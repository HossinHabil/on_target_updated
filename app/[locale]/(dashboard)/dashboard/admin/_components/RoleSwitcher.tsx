"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UsersTableProps } from "@/lib/types";
import { Role } from "@prisma/client";
import { useUpdateUserRole } from "../mutations";

const RoleSwitcher = ({ item }: { item: UsersTableProps }) => {
  const { id, role } = item;
  const { mutate } = useUpdateUserRole();

  const handleSelectChange = (role: Role) => {
    mutate({
      id,
      role,
    });
  };

  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="max-w-24 w-full">
        <SelectValue placeholder={role} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={Role.Admin}>{Role.Admin}</SelectItem>
        <SelectItem value={Role.User}>{Role.User}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default RoleSwitcher;
