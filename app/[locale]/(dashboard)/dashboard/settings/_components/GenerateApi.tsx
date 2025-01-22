"use client";

import { Button } from "@/components/ui/button";
import { useGenerateApiKey } from "../mutations";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function GenerateApi() {
  const { toast } = useToast();
  const { data, mutate, status } = useGenerateApiKey();

  const handleStatus = () => {
    switch (status) {
      case "idle":
        return "The new API key will be displayed here";
      case "pending":
        return "Generating...";
      case "success":
        return <code>{data?.data}</code>;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data?.data as string);
    toast({
      variant: "default",
      title: "API Key Copied",
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">
      <Button onClick={() => mutate()} className="max-w-32 mx-auto p-4">Generate</Button>
      <div className="border-muted-foreground w-full h-16 bg-card flex flex-col items-center justify-center relative">
        {handleStatus()}
        {status === "success" && (
          <div
            className="absolute top-6 right-4 cursor-pointer"
            title="Copy"
            onClick={handleCopy}
          >
            <Copy size={20} />
          </div>
        )}
      </div>
    </div>
  );
}
