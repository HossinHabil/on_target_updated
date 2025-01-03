import { Role } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    role: Role;
    id: string;
  }

  interface JWT {
    role: Role;
  }
}
