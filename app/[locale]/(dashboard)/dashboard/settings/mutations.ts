import { useMutation } from "@tanstack/react-query";
import { generateApiKey } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function useGenerateApiKey() {
  const { toast } = useToast();
  return useMutation({
    mutationFn: generateApiKey,
    onSuccess: (data) => {
      toast({
        title: data.message,
      });
    },
  });
}
