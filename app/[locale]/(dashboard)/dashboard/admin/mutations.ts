import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchClients, fetchUsers, updateUserRole } from "./actions";
import { Role } from "@prisma/client";

export function useFetchUsers() {
  return useQuery({
    queryKey: ["fetchUsers"],
    queryFn: fetchUsers,
  });
}

export function useUpdateUserRole() {
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole({
        id,
        role,
      }),
  });
}

export function useFetchClients() {
  return useQuery({
    queryKey: ["fetchClients"],
    queryFn: fetchClients,
  });
}
