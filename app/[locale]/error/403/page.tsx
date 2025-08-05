import { UnauthorizedView } from "@/sections/error"

export const metadata = {
  title: "403 Forbidden",
}

export default function ForbiddenPage() {
  return <UnauthorizedView />
}
