import CryptoJS from "crypto-js";

export const ENCRYPT = async ({ cipherKey, SekretKey }) => {
  return CryptoJS.AES.decrypt(cipherKey, SekretKey).toString(CryptoJS.enc.Utf8);
};
