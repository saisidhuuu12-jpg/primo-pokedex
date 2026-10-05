import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { formatId, formatName, type PokemonDetail } from "@/lib/pokeapi";
import { TypeBadge } from "./TypeBadge";

const STAT_LABEL: Record<string, string> = {
  hp: "HP", attack: "Attack", defense: "Defense",
  "special-attack": "Sp. Atk", "special-defense": "Sp. Def", speed: "Speed",
};

export function PokemonDetailDialog({ pokemon, onClose }: { pokemon: PokemonDetail | null; onClose: () => void }) {
  const main = pokemon?.types[0] ?? "normal";
  const total = pokemon?.stats.reduce((s, x) => s + x.value, 0) ?? 0;
  return (
    <Dialog open={!!pokemon} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-2xl gap-0 overflow-y-auto rounded-3xl border-0 p-0 sm:rounded-3xl">
        {pokemon && (
          <div className={`type-${main}`}>
            <div className="detail-hero relative flex flex-col items-center px-6 pt-8 pb-4">
              <div className="pokeball-watermark absolute right-[-40px] top-[-40px] h-64 w-64 opacity-40" aria-hidden />
              <span className="font-display text-sm font-bold text-muted-foreground">{formatId(pokemon.id)}</span>
              <DialogTitle className="font-display text-3xl font-extrabold sm:text-4xl">{formatName(pokemon.name)}</DialogTitle>
              <DialogDescription className="sr-only">Details and base stats for {formatName(pokemon.name)}</DialogDescription>
              <div className="mt-3 flex gap-2">
                {pokemon.types.map((t) => <TypeBadge key={t} type={t} className="text-xs" />)}
              </div>
              {pokemon.artwork && (
                <img src={pokemon.artwork} alt={`Official artwork of ${formatName(pokemon.name)}`}
                  className="relative z-10 mt-2 h-56 w-56 object-contain drop-shadow-2xl animate-in zoom-in-90 duration-500 sm:h-64 sm:w-64" />
              )}
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-3 gap-3">
                <Fact label="Height" value={`${(pokemon.height / 10).toFixed(1)} m`} />
                <Fact label="Weight" value={`${(pokemon.weight / 10).toFixed(1)} kg`} />
                <Fact label="Base XP" value={pokemon.baseExperience?.toString() ?? "—"} />
              </div>
              <section>
                <h4 className="mb-2 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {pokemon.abilities.map((a) => (
                    <span key={a.name} className="rounded-xl bg-secondary px-3 py-1.5 text-sm font-medium text-secondary-foreground">
                      {formatName(a.name)}{a.hidden && <span className="ml-1 text-xs text-muted-foreground">(hidden)</span>}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h4 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-muted-foreground">Base stats</h4>
                <dl className="space-y-2.5">
                  {pokemon.stats.map((s) => (
                    <div key={s.name} className="grid grid-cols-[72px_36px_1fr] items-center gap-3 text-sm">
                      <dt className="font-medium text-muted-foreground">{STAT_LABEL[s.name] ?? formatName(s.name)}</dt>
                      <dd className="text-right font-bold tabular-nums">{s.value}</dd>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary" role="presentation">
                        <div className="stat-bar h-full rounded-full" style={{ width: `${Math.min(100, (s.value / 200) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="grid grid-cols-[72px_36px_1fr] gap-3 border-t border-border pt-2.5 text-sm">
                    <dt className="font-bold">Total</dt>
                    <dd className="text-right font-extrabold tabular-nums">{total}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-3 text-center">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-lg font-extrabold">{value}</div>
    </div>
  );
}
