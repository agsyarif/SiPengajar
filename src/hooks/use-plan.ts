"use client";
import { useSession } from "next-auth/react";
import type { Plan } from "@/types";

export function usePlan() {
  const { data: session } = useSession();
  const plan = (session?.user as { plan?: Plan })?.plan ?? "free";

  return {
    plan,
    isPro: plan === "pro" || plan === "team",
    isTeam: plan === "team",
    isFree: plan === "free",
  };
}
