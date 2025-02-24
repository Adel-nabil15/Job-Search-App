import CryptoJS from "crypto-js";

export const DECRYPT = async ({ cipherKey, SekretKey }) => {
  return CryptoJS.AES.decrypt(cipherKey, SekretKey).toString(CryptoJS.enc.Utf8);
};
