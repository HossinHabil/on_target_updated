import Image from "next/image";
import usersRound from "@/public/dashboard/users-round.svg";
import badgeCheck from "@/public/dashboard/badge-check.svg";
import { Client } from "@prisma/client";

interface UpperBarProps {
  clientList: Client[];
}

export default function UpperBar({ clientList }: UpperBarProps) {
  const activeClients = clientList.filter(
    (item) => item.transactionStatus === "Completed"
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8 w-full">
      <div className="flex gap-4 bg-white px-8 py-4 rounded-lg">
        <div className="bg-website_primary_color_bg p-4 rounded-full">
          <Image src={usersRound} alt="Icon" width={50} height={50} />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-400">Total Customers</p>
          <h2 className="font-semibold text-4xl">{clientList.length}</h2>
        </div>
      </div>
      <div className="flex gap-4 bg-white px-8 py-4 rounded-lg">
        <div className="bg-website_primary_color_bg p-4 rounded-full">
          <Image src={badgeCheck} alt="Icon" width={50} height={50} />
        </div>
        <div className="space-y-4">
          <p className="text-zinc-400">Total Active</p>
          <h2 className="font-semibold text-4xl">{activeClients.length}</h2>
        </div>
      </div>
    </section>
  );
}
