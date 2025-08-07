export interface Setting {
  id: number;
  key: string;
  value: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}


export interface SettingsProps{
  setting?: Setting;
  onClose?: () => void;
  onSaved?: () => void;
}

