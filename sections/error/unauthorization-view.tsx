"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./error-page.module.css"

export default function UnauthorizedView() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>403</h1>
        <h2 className={styles.title}>ไม่มีสิทธิ์เข้าถึง</h2>
        <p className={styles.description}>
          คุณไม่มีสิทธิ์เข้าถึงหน้านี้
          โปรดติดต่อผู้ดูแลระบบหากคุณคิดว่านี่เป็นข้อผิดพลาด
        </p>
        <div className={styles.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
            className={styles.button}
          >
            กลับสู่หน้าหลัก
          </Button>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            className={styles.button}
          >
            กลับไปหน้าก่อนหน้า
          </Button>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/assets/error/403.svg"
          alt="Unauthorized access"
          width={400}
          height={300}
          priority
          style={{ color: "var(--mui-palette-text-primary)" }}
        />
      </div>
    </div>
  )
}
