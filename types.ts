
export type SecurityType = 'WPA' | 'WEP' | 'nopass';

export interface WifiConfig {
  ssid: string;
  password?: string;
  security: SecurityType;
  hidden: boolean;
  welcomeMessage?: string;
  hideSsidOnCard?: boolean;
  hidePasswordOnCard?: boolean;
}

export interface QRResult {
  qrDataUrl: string;
  config: WifiConfig;
  isAiLoading?: boolean;
}