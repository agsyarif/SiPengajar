export type Plan = "free" | "pro" | "team";

export interface User {
  id: string;
  name: string | null;
  email: string;
  plan: Plan;
  createdAt: Date;
}

export interface Modul {
  id: string;
  title: string;
  topic: string;
  level: string;
  duration: number;
  content: string | null;
  status: "draft" | "generating" | "done";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  prompt: string;
}
