export function SemesterDivider({ from, to }: { from: number; to: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center
                    px-3 pb-6 flex-shrink-0 self-stretch"
    >
      <div className="flex-1 w-px border-l-2 border-dashed border-stone-200" />
      <p
        className="text-[10px] text-stone-300 [writing-mode:vertical-rl]
                    rotate-180 tracking-wider uppercase py-2 whitespace-nowrap"
      >
        Sem {from} → Sem {to}
      </p>
    </div>
  );
}
