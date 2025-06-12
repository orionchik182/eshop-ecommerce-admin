import Layout from "@/components/layout/Layout";

import { auth } from "@/lib/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/login");

  const imgSrc = session.user?.image ?? "";

  return (
    <Layout>
      <div className="flex justify-between text-blue-900">
        <h1 className="text-blue-900">
          Добро пожаловать,{" "}
          <span className="font-semibold">{session.user?.name}!</span>
        </h1>
        <div className="flex items-center gap-1 bg-gray-300 text-black">
          <Image
            src={imgSrc}
            alt="avatar"
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="px-2 py-1">{session.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
