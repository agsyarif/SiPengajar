import { create } from "zustand/react";

interface EditorState {
  content: string;
  title: string;
  isDirty: boolean;
  isSaving: boolean;
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setSaving: (saving: boolean) => void;
  markClean: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: "",
  title: "",
  isDirty: false,
  isSaving: false,
  setContent: (content) => set({ content, isDirty: true }),
  setTitle: (title) => set({ title, isDirty: true }),
  setSaving: (isSaving) => set({ isSaving }),
  markClean: () => set({ isDirty: false }),
}));
