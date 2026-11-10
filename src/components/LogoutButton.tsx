"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function logout() {
    setError("");
    try {
      const response = await fetch("/API/auth/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to sign out. Please try again.");
      }
      router.replace("/");
      router.refresh();
    } catch (logoutError) {
      console.error("Sign out failed:", logoutError);
      setError(logoutError instanceof Error ? logoutError.message : "Unable to sign out.");
    }
  }

  return (
    <>
      <button className="button button-gold" type="button" onClick={logout}>
        Sign out
      </button>
      {error && <p className="auth-error" role="alert">{error}</p>}
    </>
  );
}
