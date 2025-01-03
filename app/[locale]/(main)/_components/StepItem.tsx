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
  const isFinished = parseInt(pageParam) === 6 && info.num === 5;
  return (
    <li className="flex items-center gap-4 uppercase">
      <span
        className={`flex size-10 items-center justify-center rounded-full border-2 font-medium ${
          parseInt(pageParam) === info.num || isFinished
            ? "border-indigo-300 bg-indigo-300 text-black"
            : ""
        }`}
      >
        {info.num}
      </span>
      <div className="hidden flex-col lg:flex">
        <p className="text-sm text-gray-400">{info.title}</p>
        <p>{info.description}</p>
      </div>
    </li>
  );
}
