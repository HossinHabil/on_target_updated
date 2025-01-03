import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { loginSchema } from "@/lib/schema/RegistrationFormSchema";
import { getUserByEmail } from "@/utils/user";
import { env } from "./env";

export default {
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (token && token.email) {
        const user = await getUserByEmail(token.email);

        token.role = user?.role;
        token.id = user?.id || token.id;
      }
      return token;
    },

    async session({ session, token }) {
      Object.assign(session.user, token);

      return session;
    },
  },
  secret: env.AUTH_SECRET,
} satisfies NextAuthConfig;
