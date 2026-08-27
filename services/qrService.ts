import qrcode from 'qrcode-generator';
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
    // 0 = Auto type detection, 'M' = Medium error correction
    const qr = qrcode(0, 'M');
    qr.addData(wifiString);
    qr.make();

    // Use a vector image so QR modules stay crisp at any display or print size.
    const margin = 1;
    const svg = qr.createSvgTag(1, margin);
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw err;
  }
};