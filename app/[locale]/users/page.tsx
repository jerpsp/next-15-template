import { UserListView } from "@/sections/users"
import { ThemeModeDisplay } from "@/sections/theme"
import { Container } from "@mui/material"

export const metadata = { title: "User List" }

export default function UsersPage() {
  return (
    <Container>
      <ThemeModeDisplay />
      <UserListView />
    </Container>
  )
}
