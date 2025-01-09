import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image: string;
      role: Role;
    } & DefaultSession["user"];
  }

  interface JWT {
    role: Role;
  }
}
