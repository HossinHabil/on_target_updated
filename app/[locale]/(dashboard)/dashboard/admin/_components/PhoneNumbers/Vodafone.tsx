"use client";

import TableSkeleton from "@/components/sharing/skeleton/TableSkeleton";
import { useFetchVodafoneNumbers } from "./mutations";
import VodafoneTable from "./VodafoneTable";

export default function Vodafone() {
  const { data, status } = useFetchVodafoneNumbers();

  if (status === "pending") {
    return <TableSkeleton />;
  }

  if (status === "error") {
    return (
      <h2 className="text-center text-muted-foreground">
        An error occurred while fetching clients
      </h2>
    );
  }

  if (!data.data) {
    return (
      <h2 className="text-center text-muted-foreground">{data.message}</h2>
    );
  }

  return <VodafoneTable vodafoneData={data.data} />;
}
