"use client";

import TableSkeleton from "@/components/sharing/skeleton/TableSkeleton";
import { useFetchClients } from "../mutations";
import { ClientsTable } from "./ClientsTable";

export default function Client() {
  const { data, status } = useFetchClients();

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
      <h2 className="text-center text-muted-foreground">No Clients Found</h2>
    );
  }

  return <ClientsTable clientData={data.data} />;
}
