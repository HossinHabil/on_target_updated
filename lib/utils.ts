import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import ExcelJS from "exceljs";

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

type DataRow = { [key: string]: any };

// Excel
export const exportToExcel = async (data: DataRow[], fileName: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  if (data.length > 0) {
    // Add headers from the keys of the first object in the data array
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Add rows for each data entry
    data.forEach((item) => {
      const row = headers.map((header) => item[header] || "");
      worksheet.addRow(row);
    });
  }

  const buffer = await workbook.xlsx.writeBuffer();

  // Trigger download in the browser
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// uploadthing
export const UploadButton = generateUploadButton<AppFileRouter>();
export const UploadDropzone = generateUploadDropzone<AppFileRouter>();
