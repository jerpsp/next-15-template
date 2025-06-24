"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import Cookies from "js-cookie"
import { useForm } from "react-hook-form"
import SignInSchema from "@/schema/signin"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslations } from "next-intl"

export default function SignInView() {
  const t = useTranslations()
  const [IsSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignInSchema(t)),
  })

  const onSubmit = (values: { email: string; password: string }) => {
    setIsSubmitting(true)
    signIn("domain-signin", {
      redirect: false,
      email: values.email,
      password: values.password,
      locale: Cookies.get("NEXT_LOCALE"),
    }).then((res) => {
      if (res?.status !== 200) {
        setIsSubmitting(false)
        // enqueueSnackbar(res?.error, { variant: "error" })
      }
    })
  }
  return (
    <div>
      <h1>Sign In</h1>
      <p>Please sign in to continue.</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            {...register("email")}
            type="email"
            id="email"
            name="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            {...register("password")}
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}
