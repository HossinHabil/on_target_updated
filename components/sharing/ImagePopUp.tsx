import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ImagePopUpProps {
  item: string;
  title: string;
}

export const ImagePopUp = ({ item, title }: ImagePopUpProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{title}</Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-[40rem] w-full"
      >
        <VisuallyHidden>
          <DialogTitle>{title}</DialogTitle>
        </VisuallyHidden>
        <Image
          src={item}
          width={600}
          height={600}
          alt="image"
          className="rounded-md"
        />
      </DialogContent>
    </Dialog>
  );
};
