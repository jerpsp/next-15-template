"use client"

import { Collapse, IconButton } from "@mui/material"
import { SnackbarProvider as NotistackProvider, closeSnackbar } from "notistack"
import { useRef } from "react"
import CloseIcon from "@mui/icons-material/Close"

type Props = {
  children: React.ReactNode
}

export default function SnackbarProvider({ children }: Props) {
  const notistackRef = useRef(null)

  return (
    <NotistackProvider
      ref={notistackRef}
      maxSnack={5}
      preventDuplicate
      autoHideDuration={3000}
      TransitionComponent={Collapse}
      variant="success"
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      action={(snackbarId) => (
        <IconButton
          size="small"
          onClick={() => closeSnackbar(snackbarId)}
          sx={{ p: 0.5 }}
        >
          <CloseIcon />
        </IconButton>
      )}
    >
      {children}
    </NotistackProvider>
  )
}
