import crypto from "node:crypto";
import * as config from "../../../config/config.service.js";

const ENCRYPTION_KEY = crypto.randomBytes(config.RANDOM_BYTES);

export const decrypt = (encryptedText) => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export default decrypt;
