
import { DecodedJWT } from '../types.ts';

export const decodeJWT = (token: string): DecodedJWT | null => {
  try {
    const parts = token.trim().split('.');
    if (parts.length !== 3) return null;

    const decodePart = (str: string) => {
      try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        return JSON.parse(jsonPayload);
      } catch (e) {
        return null;
      }
    };

    const header = decodePart(parts[0]);
    const payload = decodePart(parts[1]);

    if (!header || !payload) return null;

    return {
      header,
      payload,
      signature: parts[2],
      raw: token
    };
  } catch (error) {
    return null;
  }
};

export const formatTime = (timestamp: number | undefined): string => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp * 1000).toLocaleString();
};

export const generateRandomString = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const buildAuthorizeUrl = (endpoint: string, params: Record<string, string>): string => {
  const url = new URL(endpoint.trim());
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });
  return url.toString();
};
