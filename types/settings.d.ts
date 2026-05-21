export interface Setting {
  id: string
  key: string
  value: string
  created_at: string
  updated_at: string
}

export interface SettingsListResponse {
  settings: Setting[]
}

export interface SettingResponse {
  setting: Setting
}
