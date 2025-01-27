import TableSkeleton from "@/components/sharing/skeleton/TableSkeleton";
import { useFetchUsers } from "../../mutations";
import ComboboxPaymentMethods from "./ComboboxPaymentMethods";

export default function ManagePaymentMethods() {
  const { data, status } = useFetchUsers();

  if (status === "error") {
    return (
      <h2 className="text-center text-muted-foreground">
        An error occurred while fetching payment methods
      </h2>
    );
  }

  if (status === "pending") {
    return <TableSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 my-8 w-full">
      {data.data?.map((item) => (
        <div className="flex items-center justify-between gap-8 border rounded-lg p-4 bg-primary/10" key={item.id}>
          <h2 className="text-center text-muted-foreground">{item.name}</h2>
          <h2 className="text-center text-muted-foreground">{item.email}</h2>
          <ComboboxPaymentMethods paymentMethodsListUser={item.paymentMethods} userId={item.id} />
        </div>
      ))}
    </div>
  );
}
