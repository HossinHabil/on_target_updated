import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import type { AppFileRouter } from "@/app/api/uploadthing/core";

// local storage key
export const LOCAL_STORAGE_KEY = "formData";

// local storage transaction key
export const LOCAL_STORAGE_TRANSACTION_KEY = "transactionFormData";

// secret key
export const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY as string;

// cn - classnames
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// crypto-js
export const encryptData = (data: any, secretKey: string) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

// decrypt data
export const decryptData = (
  encryptedData: string,
  secretKey: string
): any | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
};

// uploadthing
export const UploadButton = generateUploadButton<AppFileRouter>();
export const UploadDropzone = generateUploadDropzone<AppFileRouter>();
