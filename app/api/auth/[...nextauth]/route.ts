import type { JWT } from "next-auth/jwt"
import NextAuth, { Account, AuthOptions, TokenSet, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import KeycloakProvider from "next-auth/providers/keycloak"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import { AdapterUser } from "next-auth/adapters"
import { pick } from "lodash"
import { ServerResErrorProps } from "@/types/error"

const domainSignin = CredentialsProvider({
  id: "domain-signin",
  name: "Domain Account",
  credentials: {
    email: { label: "Email", type: "text", placeholder: "Enter email" },
    password: { label: "Password", type: "password" },
    locale: { label: "Locale", type: "locale" },
  },
  async authorize(credentials) {
    try {
      const res = await axios.post(
        `${process.env.AUTH_ENDPOINT}/api/v1/auth/signin`,
        {
          email: credentials?.email,
          password: credentials?.password,
        },
        {
          headers: { "Accept-Language": credentials?.locale },
        }
      )

      if (res) return res.data
    } catch (error) {
      const err = error as ServerResErrorProps
      throw new Error(err?.response.data.message)
    }
  },
})

// const keycloak = KeycloakProvider({
//   clientId: process.env.KEYCLOAK_ID || "",
//   clientSecret: process.env.KEYCLOAK_SECRET || "",
//   issuer: process.env.KEYCLOAK_ISSUER,
//   profile(profile) {
//     return {
//       id: profile.sub,
//       name: profile.name ?? profile.preferred_username,
//       email: profile.email,
//       role: profile.role,
//     }
//   },
// })

type CredentialsJWTProps = {
  accessToken: string
  refreshToken: string
}

const customJWT = (account: Account | null, user: User | AdapterUser) => {
  if (!account || !user) return

  const { provider } = account

  // if (provider === keycloak.id) return keycloakJWT(account, user)
  if (provider === domainSignin.options.id)
    return credentialsJWT(account, user as unknown as CredentialsJWTProps)
}

// const keycloakJWT = (account: Account | null, user: User | AdapterUser) => {
//   return {
//     provider: account?.provider,
//     idToken: account?.id_token,
//     accessToken: account?.access_token,
//     accessTokenExpires: (account?.expires_at as number) * 1000,
//     refreshToken: account?.refresh_token,
//     user,
//   }
// }

const credentialsJWT = (account: Account | null, user: CredentialsJWTProps) => {
  const { accessToken, refreshToken } = user
  const decodedUser = jwtDecode(accessToken as string)

  return {
    provider: account?.provider,
    accessToken,
    accessTokenExpires: (decodedUser.exp as number) * 1000,
    refreshToken,
    user: pick(decodedUser, ["id", "email", "firstName", "lastName", "role"]),
  }
}

const refreshAccessToken = async (token: JWT) => {
  const { provider } = token

  // if (provider === keycloak.id) return await keycloakRefreshAccessToken(token)
  if (provider === domainSignin.options.id)
    return credentialsRefreshAccessToken(token)
  return {}
}

// const keycloakRefreshAccessToken = async (token: JWT) => {
//   try {
//     const response = await axios.post(
//       `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
//       new URLSearchParams({
//         client_id: process.env.KEYCLOAK_ID || "",
//         client_secret: process.env.KEYCLOAK_SECRET || "",
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken as string,
//       }),
//       {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     )

//     const refreshedTokens: TokenSet = await response.data

//     return {
//       ...token,
//       idToken: refreshedTokens.id_token,
//       accessToken: refreshedTokens.access_token,
//       accessTokenExpires:
//         Date.now() + (refreshedTokens.expires_in as number) * 1000,
//       refreshToken: refreshedTokens.refresh_token,
//     }
//   } catch (error) {
//     console.error("Error refreshing access token", error)
//     return { ...token, error: "RefreshAccessTokenError" }
//   }
// }

const credentialsRefreshAccessToken = async (token: JWT) => {
  try {
    const response = await axios.post(
      `${process.env.AUTH_ENDPOINT}/api/v1/auth/refresh`,
      {
        refreshToken: token.refreshToken,
      }
    )

    const { accessToken, refreshToken }: TokenSet = await response.data
    const { exp } = jwtDecode(accessToken as string)

    return {
      ...token,
      accessToken,
      accessTokenExpires: (exp as number) * 1000,
      refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token", error)
    return { ...token, error: "RefreshAccessTokenError" }
  }
}

const federatedSignout = async (token: JWT) => {
  const { provider } = token

  // if (provider == keycloak.id) await keycloakSignOut(token)
  if (provider === domainSignin.options.id) await credentialsSignOut(token)
}

// const keycloakSignOut = async (token: JWT) => {
//   try {
//     const params = new URLSearchParams({
//       id_token_hint: token.idToken as string,
//     })
//     const { status, statusText } = await axios.get(
//       `${
//         process.env.KEYCLOAK_ISSUER
//       }/protocol/openid-connect/logout?${params.toString()}`
//     )

//     console.log("Completed post-logout handshake", status, statusText)
//   } catch (error) {
//     console.error("Unable to perform post-logout handshake", error)
//     return { ...token, error: "SignoutError" }
//   }
// }

const credentialsSignOut = async (token: JWT) => {
  try {
    await axios.post(`${process.env.AUTH_ENDPOINT}/api/v1/auth/signout`, {
      refreshToken: token.refreshToken,
    })

    console.log("Completed post-logout handshake")
  } catch (error) {
    console.error("Unable to perform post-logout handshake", error)
    return { ...token, error: "SignoutError" }
  }
}

const authOptions: AuthOptions = {
  providers: [domainSignin], // add keycloak if needed
  callbacks: {
    async jwt({ token, user, account }) {
      const customToken = customJWT(account, user)
      if (customToken) return customToken

      if (Date.now() < (token.accessTokenExpires as number)) return token

      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      return {
        ...session,
        user: token.user as {},
        accessToken: token.accessToken,
        provider: token.provider,
      }
    },
  },
  events: {
    signOut: ({ token }) => federatedSignout(token),
  },
  pages: {
    signIn: "/signin",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
