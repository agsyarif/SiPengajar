"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import { Extension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Superscript as SuperscriptIcon,
  Subscript as SubscriptIcon,
  Highlighter,
  Link as LinkIcon,
  Undo2,
  Redo2,
  Heading2,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAutoSave } from "@/hooks/use-autosave";
import type { Editor } from "@tiptap/react";

const ClassAttribute = Extension.create({
  name: "classAttribute",
  addGlobalAttributes() {
    return [
      {
        types: [
          "heading",
          "paragraph",
          "bulletList",
          "orderedList",
          "listItem",
          "table",
          "tableRow",
          "tableCell",
          "tableHeader",
          "horizontalRule",
        ],
        attributes: {
          class: {
            default: null,
            parseHTML: (el) => el.getAttribute("class") || null,
            renderHTML: (attrs) => (attrs.class ? { class: attrs.class } : {}),
          },
        },
      },
    ];
  },
});

function normalizeModulHTML(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<div\s+class="modul-ajar">([\s\S]*)<\/div>\s*$/i, "$1")
    .replace(/<div\s+class="section">([\s\S]*?)<\/div>/gi, "$1")
    .replace(
      /<div\s+class="section-title">([\s\S]*?)<\/div>/gi,
      '<h2 class="section-header">$1</h2>',
    )
    .trim();
}

/* ── Toolbar separator ───────────────────────────────────── */
function Sep() {
  return <div className="w-px h-4 bg-stone-200 mx-0.5 shrink-0" />;
}

/* ── Single toolbar button ───────────────────────────────── */
function TBtn({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      disabled={disabled}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded transition-colors shrink-0 text-[13px]",
        active
          ? "bg-teal-600 text-white"
          : "text-stone-500 hover:bg-stone-100 hover:text-stone-800",
        disabled && "opacity-30 pointer-events-none",
      )}
    >
      {children}
    </button>
  );
}

/* ── Heading select ──────────────────────────────────────── */
function HeadingSelect({ editor }: { editor: Editor }) {
  const current = editor.isActive("heading", { level: 1 })
    ? "H1"
    : editor.isActive("heading", { level: 2 })
      ? "H2"
      : editor.isActive("heading", { level: 3 })
        ? "H3"
        : editor.isActive("heading", { level: 4 })
          ? "H4"
          : "P";

  return (
    <select
      value={current}
      onChange={(e) => {
        const v = e.target.value;
        if (v === "P") editor.chain().focus().setParagraph().run();
        else
          editor
            .chain()
            .focus()
            .setHeading({ level: parseInt(v[1]) as 1 | 2 | 3 | 4 })
            .run();
      }}
      className="h-7 px-1.5 text-xs font-medium text-stone-600 bg-transparent border border-stone-200 rounded hover:bg-stone-100 focus:outline-none cursor-pointer"
    >
      <option value="P">Normal</option>
      <option value="H1">Heading 1</option>
      <option value="H2">Heading 2</option>
      <option value="H3">Heading 3</option>
      <option value="H4">Heading 4</option>
    </select>
  );
}

/* ── Main toolbar ────────────────────────────────────────── */
function EditorToolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL:", prev ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="sticky top-0 z-20 flex items-center gap-0.5 flex-wrap px-3 py-1.5 bg-transparent">
      {/* History */}
      <TBtn
        onClick={() => editor.chain().focus().undo().run()}
        title="Undo"
        disabled={!editor.can().undo()}
      >
        <Undo2 size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().redo().run()}
        title="Redo"
        disabled={!editor.can().redo()}
      >
        <Redo2 size={13} />
      </TBtn>

      <Sep />

      {/* Heading */}
      <HeadingSelect editor={editor} />

      <Sep />

      {/* Lists */}
      <TBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered size={13} />
      </TBtn>

      {/* Horizontal rule */}
      <TBtn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Horizontal Rule"
      >
        <Minus size={13} />
      </TBtn>

      <Sep />

      {/* Inline formatting */}
      <TBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive("bold")}
        title="Bold"
      >
        <Bold size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive("italic")}
        title="Italic"
      >
        <Italic size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive("strike")}
        title="Strikethrough"
      >
        <Strikethrough size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive("code")}
        title="Inline Code"
      >
        <Code size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive("underline")}
        title="Underline"
      >
        <UnderlineIcon size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        active={editor.isActive("highlight")}
        title="Highlight"
      >
        <Highlighter size={13} />
      </TBtn>
      <TBtn onClick={setLink} active={editor.isActive("link")} title="Link">
        <LinkIcon size={13} />
      </TBtn>

      <Sep />

      {/* Super / subscript */}
      <TBtn
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        active={editor.isActive("superscript")}
        title="Superscript"
      >
        <SuperscriptIcon size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        active={editor.isActive("subscript")}
        title="Subscript"
      >
        <SubscriptIcon size={13} />
      </TBtn>

      <Sep />

      {/* Text align */}
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        active={editor.isActive({ textAlign: "left" })}
        title="Align Left"
      >
        <AlignLeft size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        active={editor.isActive({ textAlign: "center" })}
        title="Align Center"
      >
        <AlignCenter size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        active={editor.isActive({ textAlign: "right" })}
        title="Align Right"
      >
        <AlignRight size={13} />
      </TBtn>
      <TBtn
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        active={editor.isActive({ textAlign: "justify" })}
        title="Justify"
      >
        <AlignJustify size={13} />
      </TBtn>

      <Sep />

      {/* Table */}
      <TBtn
        onClick={() =>
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run()
        }
        title="Insert Table"
        active={editor.isActive("table")}
      >
        <Heading2 size={13} />
      </TBtn>
    </div>
  );
}

interface TipTapEditorProps {
  content: string;
  modulId: string;
  onChange?: (html: string) => void;
  onEditorReady?: (editor: Editor | null) => void;
}

export { EditorToolbar };

export function TipTapEditor({
  content,
  modulId,
  onChange,
  onEditorReady,
}: TipTapEditorProps) {
  const { saveStatus, triggerSave } = useAutoSave(modulId);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight,
      Superscript,
      Subscript,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Mulai edit bagian ini..." }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      ClassAttribute,
    ],
    content: normalizeModulHTML(content),
    editorProps: {
      attributes: {
        class: "modul-ajar min-h-[calc(100vh-200px)] outline-none px-14 py-10",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      triggerSave(html);
    },
  });

  useEffect(() => {
    onEditorReady?.(editor ?? null);
    return () => onEditorReady?.(null);
  }, [editor, onEditorReady]);

  return (
    <div className="relative">
      {/* Save status */}
      <div className="absolute top-2 right-3 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={saveStatus}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className={cn(
              "text-2xs font-medium flex items-center gap-1",
              saveStatus === "saved" && "text-teal-600",
              saveStatus === "saving" && "text-stone-400",
              saveStatus === "error" && "text-red-500",
            )}
          >
            {saveStatus === "saving" && (
              <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-pulse-dot" />
            )}
            {saveStatus === "saved" && "✓ Tersimpan"}
            {saveStatus === "saving" && "Menyimpan..."}
            {saveStatus === "error" && "Gagal simpan"}
          </motion.span>
        </AnimatePresence>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
