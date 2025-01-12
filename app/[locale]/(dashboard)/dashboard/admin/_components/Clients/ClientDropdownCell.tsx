import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ClientTablePropsWithRelations } from "@/lib/types";
import { MoreHorizontal } from "lucide-react";
import { declineReasons } from "@/lib/data";
import { ImageCarousel } from "@/components/sharing/ImageCarousel";
import {
  useApproveClient,
  useDeclineClient,
  useDeleteClient,
} from "../../mutations";

export default function ClientDropdownCell({
  item,
}: {
  item: ClientTablePropsWithRelations;
}) {
  const { mutate: deleteClientMutation } = useDeleteClient();
  const { mutate: declineClientMutation } = useDeclineClient();
  const { mutate: approveClientMutation } = useApproveClient();

  console.log(item);

  const filteredDeclineReasons = declineReasons.filter(
    (reason) =>
      reason.service.toLowerCase() === item.paymentMethodName.toLowerCase()
  );

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
          onClick={() =>
            approveClientMutation({
              id: item.id,
            })
          }
          className="cursor-pointer"
        >
          Approve
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Decline</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {filteredDeclineReasons.length ? (
                filteredDeclineReasons.map((reason) => (
                  <DropdownMenuItem
                    onClick={() =>
                      declineClientMutation({
                        id: item.id,
                        declineReason: reason.reason,
                      })
                    }
                    className="cursor-pointer"
                    key={reason.id}
                  >
                    {reason.reason}
                  </DropdownMenuItem>
                ))
              ) : (
                <span className="p-4">No Decline Reasons Found</span>
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem
          onClick={() =>
            deleteClientMutation({
              id: item.id,
            })
          }
          className="cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
        {item.imageUrl.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <ImageCarousel items={item.imageUrl} title="View Uploaded Images" />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
