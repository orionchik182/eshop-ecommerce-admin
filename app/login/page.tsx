"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading…</p>;

  return (
    <div className="flex h-screen w-screen items-center bg-blue-900">
      <div className="w-full text-center">
        {!session ? (
          <button
            className="rounded-lg bg-white p-2 px-4"
            onClick={() => signIn("google")}
          >
            Login with Google
          </button>
        ) : (
          <>
            <p>Welcome, {session.user?.email}</p>
            <button
              className="rounded-lg bg-white p-2 px-4"
              onClick={() => signOut()}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}
