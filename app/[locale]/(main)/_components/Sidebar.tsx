"use client";

import { useTranslations } from "next-intl";
import StepItem from "./StepItem";

interface SidebarProps {
  pageParam: string;
}

export default function Sidebar({ pageParam }: SidebarProps) {
  const t = useTranslations("steps");
  const stepData = [
    {
      num: 1,
      title: `${t("step_1")}`,
      description: `${t("step_1_content")}`,
    },
    {
      num: 2,
      title: `${t("step_2")}`,
      description: `${t("step_2_content")}`,
    },
    {
      num: 3,
      title: `${t("step_3")}`,
      description: `${t("step_3_content")}`,
    },
    {
      num: 4,
      title: `${t("step_4")}`,
      description: `${t("step_4_content")}`,
    },
    {
      num: 5,
      title: `${t("step_5")}`,
      description: `${t("step_5_content")}`,
    },
  ];
  return (
    <header className="flex sticky lg:fixed h-24 lg:h-full lg:max-w-[15rem] w-full items-start justify-center bg-sidebarMobile bg-cover bg-no-repeat p-6 lg:justify-start lg:rounded-md lg:bg-sidebarDesktop lg:bg-cover lg:bg-center lg:pt-10">
      <ul className="flex gap-4 text-white lg:flex-col lg:gap-8">
        {stepData.map((info, index) => {
          return <StepItem key={index} info={info} pageParam={pageParam} />;
        })}
      </ul>
    </header>
  );
}
