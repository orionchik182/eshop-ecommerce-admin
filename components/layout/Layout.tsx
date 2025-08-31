import Nav from "@/components/layout/Nav";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuth();

  if (!session) redirect("/login");

  return (
    <div className="flex min-h-screen bg-blue-900">
      <Nav />
      <div className="mt-2 mr-2 mb-2 flex grow flex-col rounded-lg bg-white p-4">
        {children}
      </div>
    </div>
  );
}
