"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  topic: z.string().min(3, "Topik minimal 3 karakter"),
  level: z.string().min(1, "Pilih tingkat"),
  duration: z.number().min(5).max(240),
});

export type StepOneData = z.infer<typeof schema>;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-stone-600">{label}</label>
      {children}
      {error && <p className="text-xs text-danger-text">{error}</p>}
    </div>
  );
}

export function StepOne({ onNext }: { onNext: (data: StepOneData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<StepOneData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 45 },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="flex flex-col gap-4">
      <Field label="Topik Modul" error={errors.topic?.message}>
        <Input placeholder="contoh: Fotosintesis" {...register("topic")} />
      </Field>
      <Field label="Tingkat" error={errors.level?.message}>
        <Input placeholder="contoh: SMA, Mahasiswa, Profesional" {...register("level")} />
      </Field>
      <Field label="Durasi (menit)" error={errors.duration?.message}>
        <Input type="number" {...register("duration", { valueAsNumber: true })} />
      </Field>
      <Button type="submit" className="mt-2">Buat Modul</Button>
    </form>
  );
}
