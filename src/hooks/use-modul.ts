"use client";
import { useState, useEffect } from "react";
import type { Modul } from "@/types";

export function useModul(id?: string) {
  const [modul, setModul] = useState<Modul | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/modul/${id}`)
      .then((r) => r.json())
      .then((data) => setModul(data))
      .catch(() => setError("Gagal memuat modul"))
      .finally(() => setLoading(false));
  }, [id]);

  return { modul, loading, error };
}

export function useModulList() {
  const [list, setList] = useState<Modul[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/modul")
      .then((r) => r.json())
      .then((data) => setList(data.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return { list, loading };
}
