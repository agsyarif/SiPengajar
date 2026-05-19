"use client";
import { useState, useRef, useCallback } from "react";

type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutoSave(modulId: string, delay = 1500) {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const triggerSave = useCallback(
    async (content: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setSaveStatus("saving");

      timerRef.current = setTimeout(async () => {
        try {
          await fetch(`/api/modul/${modulId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
          });
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
        }
      }, delay);
    },
    [modulId, delay],
  );

  return { saveStatus, triggerSave };
}
