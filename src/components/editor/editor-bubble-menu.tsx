"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { computePosition, offset, flip, shift } from "@floating-ui/dom";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  Link as LinkIcon,
  Heading2,
  Heading3,
  Code,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";

function BSep() {
  return <div className="w-px h-4 bg-white/10 mx-0.5 shrink-0" />;
}

function BBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={cn(
        "w-7 h-7 flex items-center justify-center rounded transition-all duration-100 shrink-0",
        active
          ? "bg-teal-500 text-white"
          : "text-white/70 hover:text-white hover:bg-white/10",
      )}
    >
      {children}
    </button>
  );
}

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [xy, setXy] = useState({ x: 0, y: 0 });
  // Track editor state to re-render active button states after formatting commands
  const [tick, setTick] = useState(0);

  const reposition = useCallback(() => {
    if (!menuRef.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (!rect.width && !rect.height) return;

    const virtualEl = { getBoundingClientRect: () => rect } as Element;
    computePosition(virtualEl, menuRef.current, {
      placement: "top",
      middleware: [offset(10), flip(), shift({ padding: 8 })],
    }).then(({ x, y }) => setXy({ x, y }));
  }, []);

  useEffect(() => {
    const onSelectionUpdate = () => {
      const { from, to } = editor.state.selection;
      if (from === to) {
        setVisible(false);
        return;
      }
      setTick((n) => n + 1);
      setVisible(true);
      requestAnimationFrame(reposition);
    };

    const onTransaction = () => {
      // Keep button active states in sync after formatting commands like bold/italic
      setTick((n) => n + 1);
    };

    const onBlur = () => setVisible(false);

    editor.on("selectionUpdate", onSelectionUpdate);
    editor.on("transaction", onTransaction);
    editor.on("blur", onBlur);
    return () => {
      editor.off("selectionUpdate", onSelectionUpdate);
      editor.off("transaction", onTransaction);
      editor.off("blur", onBlur);
    };
  }, [editor, reposition]);

  // Suppress unused warning — tick drives re-renders intentionally
  void tick;

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

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          key="bubble"
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          style={{ position: "fixed", left: xy.x, top: xy.y, zIndex: 9999 }}
          className="flex items-center gap-0.5 px-1.5 py-1 rounded-lg bg-stone-900/96 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.2)] border border-white/[0.08]"
          onMouseDown={(e) => e.preventDefault()}
        >
          <BBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={13} />
          </BBtn>
          <BBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={13} />
          </BBtn>

          <BSep />

          <BBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={13} />
          </BBtn>
          <BBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={13} />
          </BBtn>
          <BBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <Underline size={13} />
          </BBtn>
          <BBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough size={13} />
          </BBtn>

          <BSep />

          <BBtn
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            title="Highlight"
          >
            <Highlighter size={13} />
          </BBtn>
          <BBtn
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            <Code size={13} />
          </BBtn>
          <BBtn onClick={setLink} active={editor.isActive("link")} title="Link">
            <LinkIcon size={13} />
          </BBtn>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
