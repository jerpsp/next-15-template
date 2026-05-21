# Copilot Instructions

## Commands

```bash
yarn dev        # start dev server (Next.js 16 Turbopack) → http://localhost:3000
yarn build      # production build + TypeScript check
yarn lint       # ESLint
```

No test runner is configured.

## Architecture

### Locale-first routing
All pages live under `app/[locale]/`. The default locale is `th`, supported locales are `["th", "en"]` (defined in `locales/routing.ts`). Every URL is prefixed with the locale segment (`/th/dashboard`, `/en/posts`).

### Page → Section pattern
Pages in `app/[locale]/` are thin **server components** that:
1. Set `metadata`
2. Render a single view component imported from `sections/`

```tsx
// app/[locale]/posts/page.tsx
import PostListView from "@/sections/posts"
export const metadata = { title: "Posts" }
export default function PostsPage() { return <PostListView /> }
```

All actual UI logic lives in `sections/<resource>/`. Section views are always `"use client"`.

### Layout layers
Each resource route has a `layout.tsx` that wraps children with `<AuthGuard>` + `<AuthLayout>`:
```tsx
export default function PostsLayout({ children }) {
  return <AuthGuard><AuthLayout>{children}</AuthLayout></AuthGuard>
}
```
- `AuthGuard` (`auth/guard/`) — redirects unauthenticated users to `/signin`, redirects `user` role away from restricted pages
- `AuthLayout` (`layout/auth/`) — renders the sidebar + navbar shell
- Guest pages (signin, forgot-password) use `layout/guest/`

### Data fetching
All API calls go through TanStack Query hooks in `tanstack/query/hooks/<Resource>/`. Hooks call `NEXT_PUBLIC_API_ENDPOINT` (backend at port 4000). The session's `accessToken` is read via `useSession()` and passed as `Authorization: Bearer <token>`.

Public endpoints (`GET /posts`, `GET /categories`) work without a token — hooks pass it optionally when available.

### Auth flow
NextAuth is configured in `app/api/auth/[...nextauth]/route.ts` with a `CredentialsProvider` (`id: "domain-signin"`) that POSTs to `AUTH_ENDPOINT/api/v1/auth/signin`. On success the backend returns `{ access_token, refresh_token, user }`. The JWT callback decodes the access token and handles silent refresh when it expires.

Session shape:
```ts
session.accessToken  // string JWT
session.user.email
session.user.role    // "admin" | "moderator" | "user"
```

## Key Conventions

### Navigation — always use `@/locales/navigation`, never `next/navigation`
```ts
import { useRouter, usePathname, Link } from "@/locales/navigation"
```
These are locale-aware wrappers from `next-intl`. Using `next/navigation` directly breaks locale prefixing.

### Language switching
`useLocale()` from `next-intl` is the reactive source of truth for the current locale. `Cookies.get("NEXT_LOCALE")` is not reactive and returns `undefined` on first render — don't use it for display. When switching, set the cookie explicitly before navigating:
```ts
Cookies.set("NEXT_LOCALE", newLang, { expires: 365 })
router.replace(pathname, { locale: newLang })
```

### Translations
Use `useTranslations()` in client components, `getTranslations()` in server components. Message keys live in `locales/messages/th.json` and `locales/messages/en.json`.

### API response types — snake_case
All backend JSON fields are snake_case (Go conventions). Types in `types/*.d.ts` reflect this:
```ts
post.created_at   // ✅
post.createdAt    // ❌
post.category_id  // ✅
```

### Form validation
Schemas live in `schema/` and are Yup factory functions that accept `t` (translation function):
```ts
const schema = CreatePostSchema(t)
// used with: resolver: yupResolver(schema)
```

### Snackbar notifications
Use `enqueueSnackbar` from `notistack` directly (not a hook):
```ts
import { enqueueSnackbar } from "notistack"
enqueueSnackbar("Saved", { variant: "success" })
enqueueSnackbar(err.message, { variant: "error" })
```

### Theme mode
Read and toggle theme with `useThemeContext()` from `@/components/theme-mode/theme-context` — not MUI's `useTheme()`. Mode is persisted to `localStorage` under key `"themeMode"`.

### Sidebar role filtering
Navigation items in `layout/auth/sidebar.tsx` have an optional `roles` array. Items without `roles` are shown to everyone; items with `roles` are filtered against `session.user.role`. To restrict a nav item, add `roles: ["admin", "moderator"]`.

### Role-based access in proxy
`proxy.ts` is the Next.js middleware. It handles intl routing, auth error redirects, and role guards. The `"user"` role is restricted to `/dashboard` only. All redirects must include the locale prefix (resolved from the `NEXT_LOCALE` cookie or `routing.defaultLocale`).

### MUI conventions
- Use `sx` prop for one-off styles; avoid `styled()`
- `TableCell` font weight: `sx={{ fontWeight: 500 }}` — the `fontWeight` prop is not valid
- Hover-reveal row actions: CSS pattern `"& .row-actions": { opacity: 0 }, "&:hover .row-actions": { opacity: 1 }` on `TableRow`; action `Box` has `className="row-actions"` and needs `e.stopPropagation()` on click

## Environment Variables

```bash
NEXT_PUBLIC_API_ENDPOINT=http://localhost:4000   # shown to browser
AUTH_ENDPOINT=http://localhost:4000              # server-side only
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<secret>
```
