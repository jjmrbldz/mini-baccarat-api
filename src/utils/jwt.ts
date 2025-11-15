import { decodeJwt, jwtVerify, SignJWT } from "jose";
import { TokenPayload } from "../types";
import { FastifyRequest } from "fastify";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey)

export async function signToken(payload: TokenPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decryptToken(token: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as TokenPayload;
  } catch (error) {
    console.error('Failed to verify token', error);
    return undefined;
  }
}

export function getToken(req: FastifyRequest) {
  const a = req.headers.authorization;
  if (a?.startsWith("Bearer ")) return a.slice(7);
};

export async function decodeToken(token:string) {
  return decodeJwt(token);
}