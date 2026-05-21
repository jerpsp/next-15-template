import { SettingsView } from "@/sections/settings"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Settings",
}

export default function SettingsPage() {
  return <SettingsView />
}
