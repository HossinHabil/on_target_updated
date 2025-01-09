import { Settings, Home } from "lucide-react";

export const titleData = {
  title: [
    "Personal info",
    "Select your payment method",
    "Enter amount",
    "Finishing up",
    "Thank you!",
  ],
  description: [
    "Please provide your name, email address, and phone number.",
    "Please provide your best payment method",
    "Please enter the amount",
    "Double-check everything looks OK before confirming.",
    "Thanks for confirming your subscription! We hope you have fun using our platform. If you ever need support, please fell free to email us at support@loremgamin.com.",
  ],
};

export const paymentsActions = [
  {
    id: "1",
    name: "Deposit",
    value: "deposit",
  },
  {
    id: "2",
    name: "withdrawal",
    value: "withdrawal",
  },
];

export const paymentsMethods = [
  {
    id: "1",
    name: "Vodafone",
    value: { paymentMethodName: "vodafone" },
    image: "/main/paymentMethods/wallet.webp",
  },
  // {
  //   id: "2",
  //   name: "Fawry Pay",
  //   value: { paymentMethodName: "fawrypay" },
  //   image: "/main/paymentMethods/fawry_pay.png",
  // },
  {
    id: "3",
    name: "Bank Transfer",
    value: { paymentMethodName: "banktransfer" },
    image: "/main/paymentMethods/bank_transfer.webp",
  },
  {
    id: "4",
    name: "Insta Pay",
    value: { paymentMethodName: "instapay" },
    image: "/main/paymentMethods/instapay.webp",
  },
];

export const MenuBarLinks = [
  {
    id: 1,
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    id: 2,
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const declineReasons = [
  // Vodafone Cash Reasons
  {
    id: "VC01",
    service: "vodafone",
    reason: "Insufficient balance in Vodafone Cash account.",
  },
  {
    id: "VC02",
    service: "vodafone",
    reason: "Incorrect payment details (e.g. amount or number).",
  },
  {
    id: "VC03",
    service: "vodafone",
    reason: "Expired or inactive Vodafone Cash account.",
  },
  { id: "VC04", service: "vodafone", reason: "Network issues." },
  {
    id: "VC05",
    service: "vodafone",
    reason: "Exceeding daily limit (EGP 60,000).",
  },

  // InstaPay Reasons
  {
    id: "IP01",
    service: "InstaPay",
    reason: "Insufficient funds in the sender’s bank account.",
  },
  {
    id: "IP02",
    service: "InstaPay",
    reason: "Bank restrictions or blocks on online transactions.",
  },
  { id: "IP03", service: "InstaPay", reason: "Incorrect bank details." },
  { id: "IP04", service: "InstaPay", reason: "Exceeding transaction limits." },
  {
    id: "IP05",
    service: "InstaPay",
    reason: "Transactions attempted outside of banking hours.",
  },

  // Bank Transfer
  {
    id: "BT01",
    service: "banktransfer",
    reason: "Insufficient funds in the sender’s bank account.",
  },
  { id: "BT02", service: "banktransfer", reason: "Incorrect bank details." },
  {
    id: "BT03",
    service: "banktransfer",
    reason: "Bank restrictions on payments.",
  },
  {
    id: "BT04",
    service: "banktransfer",
    reason: "Exceeding transaction limits.",
  },
  {
    id: "BT05",
    service: "banktransfer",
    reason: "Transaction errors due to system problems",
  },

  // Fawry Cash
  { id: "FC01", service: "fawrycash", reason: "Incorrect reference code." },
  {
    id: "FC02",
    service: "fawrycash",
    reason: "System errors or network issues at Fawry kiosks.",
  },
  { id: "FC03", service: "fawrycash", reason: "Exceeding transaction limits." },

  // MyFawry App
  {
    id: "MF01",
    service: "myfawryapp",
    reason: "Insufficient balance linked to the app.",
  },
  { id: "MF02", service: "myfawryapp", reason: "Incorrect payment details." },
];
