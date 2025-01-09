"use client";

import ClientTableInfo from "./ClientTableInfo";
import { useFetchClientData } from "./mutations";
import UpperBar from "./UpperBar";
import UpperBarSkeleton from "./UpperBarSkeleton";

export default function ClientBar() {
  const { data: clientData, status } = useFetchClientData();

  if (status === "pending") {
    return <UpperBarSkeleton />;
  }

  if (!clientData?.data) {
    return <p className="text-center text-muted-foreground">No Client Found</p>;
  }

  if (status === "error") {
    return (
      <p className="text-center text-muted-foreground">
        An error occurred while fetching posts
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <UpperBar clientList={clientData.data} />
      <ClientTableInfo clientList={clientData.data} />
    </div>
  );
}
