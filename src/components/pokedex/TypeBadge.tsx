import { formatName } from "@/lib/pokeapi";
import { cn } from "@/lib/utils";

export function TypeBadge({ type, className }: { type: string; className?: string }) {
  return (
    <span
      className={cn(
        `type-${type} type-chip inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider`,
        className,
      )}
    >
      {formatName(type)}
    </span>
  );
}
