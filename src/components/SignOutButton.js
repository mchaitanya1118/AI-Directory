"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="btn-secondary"
      style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", color: "#ff4d4d", borderColor: "rgba(255, 77, 77, 0.3)" }}
    >
      Sign Out
    </button>
  );
}
