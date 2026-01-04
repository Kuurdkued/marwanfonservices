
export type ServiceCategory = 
  | 'FRP Removal' 
  | 'Passcode Removal' 
  | 'iCloud Remove' 
  | 'iCloud Bypass' 
  | 'Locked iPhone Bypass' 
  | 'Custom';

export interface DeviceSpecs {
  brand?: string;
  model: string;
  image?: string;
  launch?: string;
  display?: string;
  platform?: string;
  memory?: string;
  battery?: string;
  network?: string;
  sensors?: string;
}

export interface IndexedDevice extends DeviceSpecs {
  id: string;
  addedAt: number;
}

export interface Operation {
  id: string;
  customerName?: string;
  device: DeviceSpecs;
  imei: string;
  category: ServiceCategory;
  notes: string;
  password?: string;
  price: number;
  status: 'IN-PROGRESS' | 'DONE';
  createdAt: number;
  completedAt?: number;
}

export interface NexusState {
  isPrivacyEnabled: boolean;
  isShowroomMode: boolean;
  isDarkMode: boolean;
}
