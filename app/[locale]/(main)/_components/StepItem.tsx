"use client";

import { useTranslations } from "next-intl";

interface StepItemProps {
  pageParam: string;
  info: {
    num: number;
    title: string;
    description: string;
  };
}

export default function StepItem({ pageParam, info }: StepItemProps) {
  const t = useTranslations("info");

  return (
    <li
      className={`flex items-center gap-4 uppercase ${
        parseInt(pageParam) === info.num ? "text-blush font-semibold" : ""
      }`}
    >
      <span
        className={`flex size-10 items-center justify-center rounded-full border-2 font-semibold 
          ${parseInt(pageParam) === info.num ? "border-blush text-blush" : ""}`}
      >
        {info.num}
      </span>
      <div className="hidden flex-col lg:flex">
        <p className="text-sm">{info.title}</p>
        <p>{info.description}</p>
      </div>
    </li>
  );
}
