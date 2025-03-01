import CryptoJS from "crypto-js";

export const ENCRYPT = async ({ key, SekretKey }) => {
  return CryptoJS.AES.encrypt(key, SekretKey).toString();
};
