
import QRCode from 'qrcode';
import { WifiConfig } from '../types';

/**
 * Generates the specific WiFi string format:
 * WIFI:S:<SSID>;T:<WPA|WEP|>;P:<PASSWORD>;H:<true|false>;;
 */
export const generateWifiString = (config: WifiConfig): string => {
  const { ssid, password, security, hidden } = config;
  const p = security === 'nopass' ? '' : `P:${password};`;
  const t = security === 'nopass' ? '' : `T:${security};`;
  const h = hidden ? `H:true;` : '';
  
  return `WIFI:S:${ssid};${t}${p}${h};`;
};

export const generateQRCode = async (config: WifiConfig): Promise<string> => {
  const wifiString = generateWifiString(config);
  try {
    const dataUrl = await QRCode.toDataURL(wifiString, {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw err;
  }
};
