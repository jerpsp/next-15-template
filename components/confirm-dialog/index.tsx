"use client"

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

type Props = {
  open: boolean
  title?: string
  description?: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  open,
  title = "Confirm Delete",
  description = "Are you sure? This action cannot be undone.",
  confirmLabel = "Delete",
  loading,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600, fontSize: "1rem", pb: 1 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: "0.875rem" }}>{description}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
        <Button onClick={onClose} size="small" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          size="small"
          disabled={loading}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
