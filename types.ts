export type SecurityType = 'WPA' | 'WEP' | 'nopass';

export interface WifiConfig {
  ssid: string;
  password?: string;
  security: SecurityType;
  hidden: boolean;
  welcomeMessage?: string;
  hideSsidOnCard?: boolean;
  hidePasswordOnCard?: boolean;
  // Business Fields
  companyName?: string;
  companyWebsite?: string;
  contactName?: string;
  contactPhone?: string;
  contactAddress?: string;
  contactEmail?: string;
  notes?: string;
}

export interface QRResult {
  qrDataUrl: string;
  config: WifiConfig;
  isAiLoading?: boolean;
}