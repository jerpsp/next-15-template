"use client"

import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"

type UserProps = {
  users: any
  count: number
}

export default function UserListView() {
  const [data, setData] = useState<UserProps>()
  const t = useTranslations()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_ENDPOINT + "/api/v1/users"
        )
        const result = await response.json()
        setData(result)
      } catch (error) {}
    }
    fetchData()
  }, [])

  console.log(data)

  return (
    <div>
      <h1>{t("user.userListView")}</h1>

      {data?.users.map((user: any) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </div>
  )
}
