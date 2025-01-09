"use client";

import TableSkeleton from "@/components/sharing/skeleton/TableSkeleton";
import { useFetchUsers } from "../mutations";
import UsersTable from "./UsersTable";

export default function Users() {
  const { data, status } = useFetchUsers();

  if (status === "pending") {
    return <TableSkeleton />;
  }

  if (status === "error") {
    return (
      <h2 className="text-center text-muted-foreground">
        An error occurred while fetching users
      </h2>
    );
  }

  if (!data.data) {
    return (
      <h2 className="text-center text-muted-foreground">No Users Found</h2>
    );
  }

  return <UsersTable usersList={data.data} />;
}
