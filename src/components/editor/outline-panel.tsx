"use client";

interface OutlineItem {
  id: string;
  level: number;
  text: string;
}

export function OutlinePanel({ items }: { items: OutlineItem[] }) {
  if (!items.length) {
    return (
      <div className="p-4 text-xs text-stone-400">
        Tambahkan heading untuk melihat outline
      </div>
    );
  }

  return (
    <nav className="p-3 flex flex-col gap-0.5">
      <p className="label-section mb-2">Outline</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="block text-xs text-stone-600 hover:text-teal-600 transition-colors truncate"
          style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}
