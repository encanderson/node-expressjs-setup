import crypto from "crypto";

export const hashFunction = (field: string): string => {
  const hash = crypto.createHash("sha256").update(field).digest("hex");

  return hash;
};
