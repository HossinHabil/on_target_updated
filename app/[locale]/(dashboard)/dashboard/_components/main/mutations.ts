import { QueryKey, useQuery } from "@tanstack/react-query";
import { clientData } from "./actions";

export function useFetchClientData() {
  const queryKey: QueryKey = ["fetchClientData"];
  const query = useQuery({
    queryKey,
    queryFn: clientData,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  return query;
}
