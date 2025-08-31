import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

// обязательный экспорт для GET и POST
export { handler as GET, handler as POST };
