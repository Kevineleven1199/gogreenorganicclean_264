"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type LogoutButtonProps = {
  variant?: "link" | "button";
  className?: string;
};

export const LogoutButton = ({ variant = "link", className }: LogoutButtonProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/");
      router.refresh();
    });
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={pending}
        className={className ?? "rounded-full border border-accent px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent"}
      >
        {pending ? "Signing out..." : "Sign out"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      className={className ?? "text-xs font-semibold uppercase tracking-[0.24em] text-accent"}
    >
      {pending ? "Signing out..." : "Log out"}
    </button>
  );
};
