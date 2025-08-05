import DashboardView from "@/sections/dashboard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return <DashboardView />
}
