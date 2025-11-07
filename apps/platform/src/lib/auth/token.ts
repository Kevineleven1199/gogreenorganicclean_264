import { SignJWT, jwtVerify, type JWTPayload } from "jose";

export const SESSION_COOKIE = "gg_session";

export type SessionPayload = {
  userId: string;
  email: string;
  role: "HQ" | "CLEANER" | "CUSTOMER";
  name: string;
};

const getSecret = () => {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "gogreen-portal-secret";
  return new TextEncoder().encode(secret);
};

export const createSessionToken = async (payload: SessionPayload, expiresIn: string | number = "7d") =>
  new SignJWT(payload as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getSecret());

export const verifySessionToken = async (token?: string | null) => {
  if (!token) return null;
  try {
    const result = await jwtVerify(token, getSecret());
    return result.payload as SessionPayload;
  } catch {
    return null;
  }
};
