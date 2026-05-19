"use client";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import type { Editor } from "@tiptap/react";

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const actions = [
    { icon: Bold, label: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
    { icon: Italic, label: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
    { icon: Underline, label: "Underline", action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline") },
    { icon: AlignLeft, label: "Rata Kiri", action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }) },
    { icon: AlignCenter, label: "Tengah", action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }) },
    { icon: List, label: "List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
  ];

  return (
    <div className="flex items-center gap-1 p-2 border-b border-stone-200">
      {actions.map(({ icon: Icon, label, action, active }) => (
        <Tooltip key={label} content={label}>
          <Button
            variant={active ? "ghost-stone" : "ghost"}
            size="icon"
            onClick={action}
            type="button"
          >
            <Icon size={14} />
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
