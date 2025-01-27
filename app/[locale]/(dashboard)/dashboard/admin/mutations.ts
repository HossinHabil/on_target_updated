import { QueryKey, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approveClient, declineClient, deleteClient, deleteUser, fetchClients, fetchUsers, updateUserRole } from "./actions";
import { Role } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";

const clientsQueryKey: QueryKey = ["fetchClients"];
const usersQueryKey: QueryKey = ["fetchUsers"];
const paymentMethodsQueryKey: QueryKey = ["paymentMethods"];

export function useFetchUsers() {
  return useQuery({
    queryKey: usersQueryKey,
    queryFn: fetchUsers,
  });
}


export function useFetchClients() {
  return useQuery({
    queryKey: clientsQueryKey,
    queryFn: fetchClients,
  });
}

export function useDeleteClient() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id}: {id: string}) => deleteClient({id}),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: clientsQueryKey });
      queryClient.invalidateQueries({ queryKey: clientsQueryKey });
      toast({
        title: data?.message
      });
    }
  })
}

export function useUpdateUserRole() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: Role }) =>
      updateUserRole({
        id,
        role,
      }),
      onSuccess: (data) => {
        toast({
          title: data?.message
        });
      }
  });
}

export function useDeclineClient() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({id, declineReason}: {id: string, declineReason: string}) => declineClient({
      id,
      declineReason
    }),
    onSuccess: (data) => {
      toast({
        title: data?.message
      })
    }
  })
}

export function useApproveClient() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({id}: {id: string}) => approveClient({
      id
    }),
    onSuccess: (data) => {
      toast({
        title: data?.message
      })
    }
  })
}

export function useDeleteUser() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({id}: {id: string}) => deleteUser({id}),
    onSuccess: async (data) => {
      await queryClient.cancelQueries({ queryKey: usersQueryKey });
      queryClient.invalidateQueries({ queryKey: usersQueryKey });
      toast({
        title: data?.message
      });
    }
  })
}
