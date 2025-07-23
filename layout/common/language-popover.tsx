import { useCallback, useState, MouseEvent } from "react"
import { useRouter, usePathname } from "@/locales/navigation"
import Cookies from "js-cookie"
import { MenuItem, IconButton, Typography, Popover } from "@mui/material"
import Image from "next/image"

export default function LanguagePopover() {
  const router = useRouter()
  const pathname = usePathname()
  const currentLang = Cookies.get("NEXT_LOCALE")

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
      router.push(pathname, { locale: newLang })
      handleClose()
    },
    [router, pathname]
  )

  const allLangs = [
    {
      label: "English",
      value: "en",
      icon: "/assets/icons/en.png",
    },
    {
      label: "Thai",
      value: "th",
      icon: "/assets/icons/th.png",
    },
  ]

  const currnetLangLabel = useCallback(
    () => allLangs.find((lang) => lang.value === currentLang)?.value ?? "",
    [currentLang]
  )

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          width: 40,
          height: 40,
          ...(open && {
            bgcolor: "action.selected",
          }),
        }}
      >
        <Typography variant="h6" color="text.primary">
          {currnetLangLabel().toUpperCase()}
        </Typography>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{ width: 160 }}
      >
        {allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang}
            onClick={() => handleChangeLang(option.value)}
            sx={{ m: 0.5, borderRadius: 1 }}
          >
            {/* <Image src={option.icon} alt="en-lang" width="22" height="22" /> */}
            <Typography sx={{ ml: 0 }}>{option.label}</Typography>
          </MenuItem>
        ))}
      </Popover>
    </>
  )
}
