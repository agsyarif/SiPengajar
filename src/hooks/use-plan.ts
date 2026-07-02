"use client";
import { useSession } from "next-auth/react";
import type { Plan } from "@/types";

export function usePlan() {
  const { data: session } = useSession();
  const plan = (session?.user as { plan?: Plan })?.plan ?? "FREE";

  return {
    plan,
    isPro: plan === "PRO" || plan === "SCHOOL",
    isSchool: plan === "SCHOOL",
    isFree: plan === "FREE",
  };
}
