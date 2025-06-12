import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google"; // пример провайдера

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
  // …любые callbacks / pages / adapter
};

const handler = NextAuth(authOptions);

// обязательный экспорт для GET и POST
export { handler as GET, handler as POST };
