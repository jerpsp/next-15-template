"use client"

import { Button } from "@mui/material"
import { useRouter } from "next/navigation"
import Image from "next/image"
import styles from "./error-page.module.css"

export default function NotFoundView() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>หน้าที่คุณค้นหาไม่พบ</h2>
        <p className={styles.description}>
          หน้าที่คุณพยายามเข้าถึงอาจถูกลบ เปลี่ยนชื่อ หรือไม่มีอยู่ชั่วคราว
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
          src="/assets/error/404.svg"
          alt="Page not found"
          width={400}
          height={300}
          priority
          style={{ color: "var(--mui-palette-text-primary)" }}
        />
      </div>
    </div>
  )
}
