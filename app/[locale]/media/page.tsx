import { MediaListView } from "@/sections/media"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Media",
  description: "Media library",
}

export default function MediaPage() {
  return <MediaListView />
}
