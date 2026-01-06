import QRCode from 'qrcode';
import { WifiConfig } from '../types';

/**
 * Escapes special characters for the WIFI URI scheme.
 * Characters to escape: \ ; , : "
 */
const escapeWifiString = (str: string): string => {
  if (!str) return '';
  return str.replace(/([\\;,":])/g, '\\$1');
};

/**
 * Generates the specific WiFi string format:
 * WIFI:S:<SSID>;T:<WPA|WEP|>;P:<PASSWORD>;H:<true|false>;;
 */
export const generateWifiString = (config: WifiConfig): string => {
  const { ssid, password, security, hidden } = config;
  
  const escapedSSID = escapeWifiString(ssid);
  const escapedPassword = escapeWifiString(password || '');
  
  const p = security === 'nopass' ? '' : `P:${escapedPassword};`;
  const t = security === 'nopass' ? '' : `T:${security};`;
  const h = hidden ? `H:true;` : '';
  
  return `WIFI:S:${escapedSSID};${t}${p}${h};`;
};

export const generateQRCode = async (config: WifiConfig): Promise<string> => {
  const wifiString = generateWifiString(config);
  try {
    const dataUrl = await QRCode.toDataURL(wifiString, {
      width: 1024, // Optimized for high-quality printing
      margin: 1,   // Minimal margin to maximize QR size
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw err;
  }
};