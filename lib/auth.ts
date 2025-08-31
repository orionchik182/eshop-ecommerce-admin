import client from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import Google from "next-auth/providers/google";

const adminEmails = ["serg.batumi2022@gmail.com"];

// Теперь мы экспортируем authOptions из этого центрального файла
export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(client),
  session: {
    strategy: "database",
  },
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
      if (!user.email) {
        return false;
      }
      return adminEmails.includes(user.email);
    },
    async session({ session }) {
      return session;
    },
  },
};

// Вспомогательная функция, чтобы не импортировать getServerSession и authOptions каждый раз
export const getAuth = () => getServerSession(authOptions);
