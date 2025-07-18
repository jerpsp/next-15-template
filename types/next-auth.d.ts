import NextAuth, { Profile } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken?: string
    user: {
      email?: string
      firstName?: string
      lastName?: string
      role?: string
      active?: boolean
    }
    provider?: string
    error?: string
  }

  interface Profile {
    role?: string & Profile
  }
}
