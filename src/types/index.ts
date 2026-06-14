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

export type SoloLevel = "MULTISTRUCTURAL" | "RELATIONAL" | "EXTENDED_ABSTRACT";

export interface LearningFlowItem {
  sequence: number;
  phase: "Memahami" | "Mengaplikasi" | "Merefleksi";
  description: string;
}

export interface ObjectiveDetail {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  soloLevel: SoloLevel;
  allocationHours: number;
  cpElements: string[];
  profileDimensions: string[];
  formativeAssessment: string;
  summativeAssessment: string;
  learningFlow: LearningFlowItem[];
}

export interface ChapterWithObjectives {
  id: string;
  number: number;
  name: string;
  grade: string;
  semester: number;
  objectives: ObjectiveDetail[];
}

export interface LearningOutcomeWithChapters {
  id: string;
  subject: string;
  phase: string;
  level: string;
  elements: { name: string; description: string }[];
  chapters: ChapterWithObjectives[];
}

export const SOLO_CONFIG = {
  MULTISTRUCTURAL: {
    label: "Multistructural",
    short: "M",
    sublabel: "Surface",
    bgClass: "bg-[#E6F1FB]",
    borderClass: "border-[#185FA5]",
    textClass: "text-[#0C447C]",
    dotColor: "#185FA5",
  },
  RELATIONAL: {
    label: "Relational",
    short: "R",
    sublabel: "Deep",
    bgClass: "bg-teal-50",
    borderClass: "border-teal-600",
    textClass: "text-teal-800",
    dotColor: "#0F6E56",
  },
  EXTENDED_ABSTRACT: {
    label: "Extended Abstract",
    short: "EA",
    sublabel: "Deep+",
    bgClass: "bg-violet-50",
    borderClass: "border-violet-600",
    textClass: "text-violet-800",
    dotColor: "#534AB7",
  },
} as const;
