"use client";

import { useAuth } from "@/context/AuthContext";

export default function TestAuthPage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-3xl mb-4">Auth Context Test</h1>
      {user ? (
        <p>✅ Logged in as: {user.email}</p>
      ) : (
        <p>❌ No user logged in</p>
      )}
    </div>
  );
}
