import crypto from "crypto";
import bcrypt from "bcryptjs";

/** Generates a cryptographically random 6-digit OTP string */
export function generateOtp(): string {
  return String(crypto.randomInt(100000, 999999));
}

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/** Returns a Date 10 minutes from now */
export function otpExpiry(): Date {
  return new Date(Date.now() + 10 * 60 * 1000);
}
