import { QueryKey, useQuery } from "@tanstack/react-query";
import { fetchUsersThroughTransactionId } from "./actions";

const usersQueryKey: QueryKey = ["fetchUsers"];
export function useFetchUsersThroughTransactionId({transactionId}: {transactionId: string | null}) {
    return useQuery({
      queryKey: usersQueryKey,
      queryFn: () => fetchUsersThroughTransactionId({transactionId}),
    });
  }