import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import * as XLSX from "xlsx";

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

// Delay
export async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// Adjust timezone
export const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === "string") {
    // Split the date string to get year, month, and day parts
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    // Create a new Date object using the local timezone
    // Note: Month is 0-indexed, so subtract 1 from the month part
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date;
  } else {
    // If dateInput is already a Date object, return it directly
    return dateInput;
  }
};

// Excel
export const exportToExcel = (data: any, fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, fileName);
};

// uploadthing
export const UploadButton = generateUploadButton<AppFileRouter>();
export const UploadDropzone = generateUploadDropzone<AppFileRouter>();
