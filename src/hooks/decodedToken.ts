import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  status: string;
  profilePhoto: string;
  iat: number;
  exp: number;
}

/**
 * Decodes a JWT and returns the payload.
 * @param token - The JWT string to decode.
 * @returns DecodedToken object or null if invalid or expired.
 */
export const decodeToken = (token: string): DecodedToken => {
  const decoded = jwtDecode<DecodedToken>(token);
  return decoded;
};
