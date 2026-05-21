"use client"

import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { useThemeContext } from "@/components/theme-mode/theme-context"
import {
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material"
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined"
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import CheckIcon from "@mui/icons-material/Check"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import * as yup from "yup"

// ─── Types ────────────────────────────────────────────────────────────────────

type GeneralFormData = {
  siteName: string
  siteDescription: string
  defaultLanguage: "en" | "th"
}

type AccountFormData = {
  displayName: string
}

// ─── Sub-sections ─────────────────────────────────────────────────────────────

function GeneralSection() {
  const t = useTranslations()

  const schema: any = yup.object({
    siteName: yup.string().required(t("validation.required") || "Required"),
    siteDescription: yup.string().default(""),
    defaultLanguage: yup.string().oneOf(["en", "th"]).required(),
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<GeneralFormData>({
    defaultValues: {
      siteName: "CMS",
      siteDescription: "Manage your content with ease.",
      defaultLanguage: "en",
    },
    resolver: yupResolver(schema) as any,
  })

  const onSubmit: SubmitHandler<GeneralFormData> = async () => {
    await new Promise((r) => setTimeout(r, 400))
    enqueueSnackbar(t("settings.saveSuccess") || "Settings saved", { variant: "success" })
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={2.5}>
        <TextField
          {...register("siteName")}
          required
          fullWidth
          label={t("settings.siteName") || "Site Name"}
          error={!!errors.siteName}
          helperText={errors.siteName?.message}
          disabled={isSubmitting}
        />

        <TextField
          {...register("siteDescription")}
          fullWidth
          multiline
          rows={3}
          label={t("settings.siteDescription") || "Site Description"}
          error={!!errors.siteDescription}
          helperText={errors.siteDescription?.message}
          disabled={isSubmitting}
        />

        <Controller
          name="defaultLanguage"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth disabled={isSubmitting}>
              <InputLabel>{t("settings.defaultLanguage") || "Default Language"}</InputLabel>
              <Select {...field} label={t("settings.defaultLanguage") || "Default Language"}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="th">ไทย</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 0.5 }}>
          <Button type="submit" variant="contained" size="small" disabled={isSubmitting} sx={{ minWidth: 100 }}>
            {isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              t("settings.save") || "Save"
            )}
          </Button>
        </Box>
      </Stack>
    </Box>
  )
}

function AppearanceSection() {
  const { mode, toggleThemeMode } = useThemeContext()

  const themes = [
    {
      value: "light",
      label: "Light",
      icon: <LightModeOutlinedIcon sx={{ fontSize: 28 }} />,
      description: "Clean white interface",
    },
    {
      value: "dark",
      label: "Dark",
      icon: <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />,
      description: "Easy on the eyes",
    },
  ]

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Color Mode
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
          Choose how the interface looks for you. Stored locally in your browser.
        </Typography>

        <Box sx={{ display: "flex", gap: 2 }}>
          {themes.map((theme) => {
            const active = mode === theme.value
            return (
              <Box
                key={theme.value}
                onClick={() => { if (!active) toggleThemeMode() }}
                sx={{
                  flex: 1,
                  maxWidth: 180,
                  border: "2px solid",
                  borderColor: active ? "primary.main" : "divider",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                  cursor: active ? "default" : "pointer",
                  position: "relative",
                  transition: "border-color 0.15s, background 0.15s",
                  bgcolor: active ? "action.selected" : "transparent",
                  "&:hover": {
                    borderColor: active ? "primary.main" : "text.secondary",
                    bgcolor: active ? "action.selected" : "action.hover",
                  },
                }}
              >
                {active && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckIcon sx={{ fontSize: 12, color: "primary.contrastText" }} />
                  </Box>
                )}
                <Box sx={{ color: active ? "primary.main" : "text.secondary" }}>
                  {theme.icon}
                </Box>
                <Typography variant="body2" fontWeight={active ? 600 : 400}>
                  {theme.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" align="center">
                  {theme.description}
                </Typography>
              </Box>
            )
          })}
        </Box>
      </Box>
    </Stack>
  )
}

function AccountSection() {
  const { data: session } = useSession()
  const email = session?.user?.email ?? ""
  const role = session?.user?.role ?? ""

  const initials = email ? email[0].toUpperCase() : "?"

  const ROLE_COLOR: Record<string, "default" | "primary" | "warning" | "error"> = {
    admin: "error",
    moderator: "warning",
    user: "default",
  }

  const [isSaving, setIsSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AccountFormData>({
    defaultValues: { displayName: email.split("@")[0] },
  })

  const onSubmit: SubmitHandler<AccountFormData> = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 400))
    setIsSaving(false)
    enqueueSnackbar("Profile updated", { variant: "success" })
  }

  return (
    <Stack spacing={3}>
      {/* Profile summary */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 48, height: 48, fontSize: "1.1rem", fontWeight: 700, bgcolor: "grey.200", color: "text.primary" }}>
          {initials}
        </Avatar>
        <Box>
          <Typography variant="body2" fontWeight={600}>{email}</Typography>
          <Chip
            label={role}
            size="small"
            color={ROLE_COLOR[role] ?? "default"}
            sx={{ mt: 0.5, height: 18, fontSize: "0.65rem", fontWeight: 600 }}
          />
        </Box>
      </Box>

      <Divider />

      {/* Editable fields */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            disabled
            helperText="Email cannot be changed here"
            size="small"
          />
          <TextField
            {...register("displayName")}
            fullWidth
            label="Display Name"
            error={!!errors.displayName}
            helperText={errors.displayName?.message}
            disabled={isSaving}
            size="small"
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button type="submit" variant="contained" size="small" disabled={isSaving} sx={{ minWidth: 100 }}>
              {isSaving ? <CircularProgress size={16} color="inherit" /> : "Save"}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Stack>
  )
}

// ─── Nav items ────────────────────────────────────────────────────────────────

const navItems = [
  { key: "general", label: "General", icon: <TuneOutlinedIcon sx={{ fontSize: 18 }} /> },
  { key: "appearance", label: "Appearance", icon: <PaletteOutlinedIcon sx={{ fontSize: 18 }} /> },
  { key: "account", label: "Account", icon: <AccountCircleOutlinedIcon sx={{ fontSize: 18 }} /> },
]

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  general: { title: "General", subtitle: "Configure your site name, description and default language." },
  appearance: { title: "Appearance", subtitle: "Customize how the interface looks." },
  account: { title: "Account", subtitle: "View your profile information." },
}

// ─── Main view ────────────────────────────────────────────────────────────────

export default function SettingsView() {
  const t = useTranslations()
  const [activeSection, setActiveSection] = useState("general")

  const info = sectionTitles[activeSection]

  return (
    <Box sx={{ maxWidth: 860, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {t("settings.title") || "Settings"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your site configuration and preferences
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
        {/* Side nav */}
        <Paper sx={{ width: 200, flexShrink: 0, p: 1 }}>
          <List disablePadding>
            {navItems.map((item) => {
              const active = activeSection === item.key
              return (
                <ListItemButton
                  key={item.key}
                  selected={active}
                  onClick={() => setActiveSection(item.key)}
                  sx={{ borderRadius: 1.5, mb: 0.25, gap: 1 }}
                >
                  <Box sx={{ color: active ? "primary.main" : "text.secondary", display: "flex" }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    slotProps={{ primary: { variant: "body2", fontWeight: active ? 600 : 400 } }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Paper>

        {/* Content */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {info.title}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2.5 }}>
            {info.subtitle}
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {activeSection === "general" && <GeneralSection />}
          {activeSection === "appearance" && <AppearanceSection />}
          {activeSection === "account" && <AccountSection />}
        </Paper>
      </Box>
    </Box>
  )
}
