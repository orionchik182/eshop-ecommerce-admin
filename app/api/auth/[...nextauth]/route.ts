import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { User } from "next-auth";
import Google from "next-auth/providers/google"; // пример провайдера

const adminEmails = ["serg.batumi2022@gmail.com"];

export const authOptions = {
  adapter: MongoDBAdapter(client),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      return adminEmails.includes(user.email ?? "");
    },
  },
  // …любые callbacks / pages / adapter
};

const handler = NextAuth(authOptions);

// обязательный экспорт для GET и POST
export { handler as GET, handler as POST };
