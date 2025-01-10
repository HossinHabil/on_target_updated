import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Vodafone } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import { useDeleteVodafonePhoneNumber } from "./mutations";

export default function VodafoneDropdownCell(item: Vodafone) {
  const { mutate } = useDeleteVodafonePhoneNumber();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          className="cursor-pointer bg-primary font-semibold text-muted hover:!text-muted justify-center hover:!bg-primary"
          onClick={() => mutate(item)}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
