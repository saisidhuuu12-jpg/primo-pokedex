import { formatId, formatName, type PokemonDetail } from "@/lib/pokeapi";
import { TypeBadge } from "./TypeBadge";
import { Skeleton } from "@/components/ui/skeleton";

export function PokemonCard({ pokemon, onSelect }: { pokemon: PokemonDetail; onSelect: (p: PokemonDetail) => void }) {
  const main = pokemon.types[0] ?? "normal";
  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon)}
      aria-label={`View details for ${formatName(pokemon.name)}`}
      className={`type-${main} poke-card group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-4 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring`}
    >
      <span className="font-display text-sm font-bold text-muted-foreground">{formatId(pokemon.id)}</span>
      <div className="poke-card-art relative mx-auto my-2 flex aspect-square w-full items-center justify-center rounded-2xl">
        <div className="pokeball-watermark absolute inset-4 opacity-60" aria-hidden />
        {pokemon.artwork ? (
          <img
            src={pokemon.artwork}
            alt={formatName(pokemon.name)}
            loading="lazy"
            className="relative z-10 h-[80%] w-[80%] object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="text-muted-foreground">No image</span>
        )}
      </div>
      <h3 className="font-display text-lg font-extrabold text-foreground">{formatName(pokemon.name)}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {pokemon.types.map((t) => <TypeBadge key={t} type={t} />)}
      </div>
    </button>
  );
}

export function PokemonCardSkeleton() {
  return (
    <div className="flex flex-col rounded-3xl border border-border bg-card p-4" aria-hidden>
      <Skeleton className="h-4 w-12" />
      <Skeleton className="my-2 aspect-square w-full rounded-2xl" />
      <Skeleton className="h-5 w-2/3" />
      <div className="mt-2 flex gap-1.5">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
    </div>
  );
}
