import crypto from "crypto";

// Function to generate a random reset token
export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
}
