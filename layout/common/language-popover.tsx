"use client"

import { useCallback, useState, MouseEvent } from "react"
import { useRouter, usePathname } from "@/locales/navigation"
import { useLocale } from "next-intl"
import Cookies from "js-cookie"
import { MenuItem, IconButton, Typography, Popover } from "@mui/material"

const allLangs = [
  { label: "English", value: "en" },
  { label: "Thai", value: "th" },
]

export default function LanguagePopover() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()                      // reactive — always correct
  const currentLang = locale || "th"              // fallback to default

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleChangeLang = useCallback(
    (newLang: string) => {
      // Set cookie immediately so signin and other reads are in sync
      Cookies.set("NEXT_LOCALE", newLang, { expires: 365 })
      router.push(pathname, { locale: newLang })
      handleClose()
    },
    [router, pathname]
  )

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1,
          ...(open && { bgcolor: "action.selected" }),
        }}
      >
        <Typography variant="caption" fontWeight={600} color="text.primary" sx={{ letterSpacing: "0.04em" }}>
          {currentLang.toUpperCase()}
        </Typography>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 0.5, minWidth: 130 } } }}
      >
        {allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang}
            onClick={() => handleChangeLang(option.value)}
            sx={{ fontSize: "0.875rem", m: 0.5, borderRadius: 1 }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}
