"use client";

import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") return <p>Loading…</p>;
  if (status === "authenticated") return null;

  return (
    <div className="flex h-screen w-screen items-center bg-gray-200">
      <div className="w-full text-center">
        <button
          className="rounded-lg bg-white p-2 px-4"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
