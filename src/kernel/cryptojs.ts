import * as CryptoJS from "crypto-js";

export const encrypt = (data: object): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), "secret").toString();
};

export const decrypt = (data: string): object => {
  return JSON.parse(
    CryptoJS.AES.decrypt(data, "secret").toString(CryptoJS.enc.Utf8)
  );
};

export const encryptParamsId = (id: string): string => {
  let encrypted = encrypt({ id: id });
  encrypted = encrypted.replace(/\//g, "_");
  return encrypted;
};

export const decryptParamsId = (encryptedId: string): Object => {
  encryptedId = encryptedId.replace(/_/g, "/");
  const decryptObjId = decrypt(encryptedId);
  return decryptObjId;
};
