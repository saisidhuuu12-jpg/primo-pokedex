import { createFileRoute } from "@tanstack/react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AlertTriangle, Loader2, RotateCw, Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchPokemonPage, PAGE_SIZE, type PokemonDetail } from "@/lib/pokeapi";
import { PokemonCard, PokemonCardSkeleton } from "@/components/pokedex/PokemonCard";
import { PokemonDetailDialog } from "@/components/pokedex/PokemonDetailDialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pokédex — Browse every Pokémon" },
      { name: "description", content: "A fast, beautiful Pokédex powered by PokéAPI. Browse Pokémon 20 at a time, search, and view stats." },
      { property: "og:title", content: "Pokédex — Browse every Pokémon" },
      { property: "og:description", content: "Browse Pokémon, view official artwork, types, abilities and base stats." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Pokedex,
});

function Pokedex() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PokemonDetail | null>(null);

  const q = useInfiniteQuery({
    queryKey: ["pokemon-pages"],
    queryFn: ({ pageParam, signal }) => fetchPokemonPage(pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (last) => last.nextOffset ?? undefined,
    staleTime: Infinity,
    retry: 1,
  });

  const all = useMemo(() => q.data?.pages.flatMap((p) => p.items) ?? [], [q.data]);
  const total = q.data?.pages[0]?.total;
  const term = query.trim().toLowerCase();
  const visible = term
    ? all.filter((p) => p.name.includes(term) || String(p.id) === term.replace(/^#0*/, ""))
    : all;

  return (
    <div className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b border-border bg-card">
        <div className="header-stripe absolute inset-x-0 top-0 h-1.5" aria-hidden />
        <div className="mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="pokeball-logo h-10 w-10 shrink-0" aria-hidden />
            <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">Pokédex</h1>
          </div>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Browse the world of Pokémon. Tap any card for artwork, abilities and base stats.
          </p>
          <div className="relative mt-6 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search loaded Pokémon by name or number"
              aria-label="Search loaded Pokémon"
              className="h-13 rounded-2xl border-2 bg-background pl-12 pr-12 text-base focus-visible:border-primary focus-visible:ring-0"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {all.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground" aria-live="polite">
              {term ? `${visible.length} match${visible.length === 1 ? "" : "es"} among ` : "Showing "}
              <span className="font-semibold text-foreground">{all.length}</span>
              {total ? ` of ${total.toLocaleString()}` : ""} loaded Pokémon
            </p>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {q.isPending ? (
          <Grid>{Array.from({ length: PAGE_SIZE }, (_, i) => <PokemonCardSkeleton key={i} />)}</Grid>
        ) : q.isError && all.length === 0 ? (
          <ErrorState message={q.error.message} onRetry={() => q.refetch()} />
        ) : (
          <>
            {visible.length === 0 ? (
              <div className="flex flex-col items-center py-20 text-center">
                <SearchX className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 font-display text-xl font-bold">No Pokémon found</h2>
                <p className="mt-1 max-w-sm text-muted-foreground">
                  {term ? `Nothing matches “${query}” in the ${all.length} loaded Pokémon. Try loading more or clearing the search.` : "No Pokémon available."}
                </p>
                {term && <Button variant="outline" className="mt-4 rounded-full" onClick={() => setQuery("")}>Clear search</Button>}
              </div>
            ) : (
              <Grid>
                {visible.map((p) => <PokemonCard key={p.id} pokemon={p} onSelect={setSelected} />)}
                {q.isFetchingNextPage && !term &&
                  Array.from({ length: PAGE_SIZE }, (_, i) => <PokemonCardSkeleton key={`s${i}`} />)}
              </Grid>
            )}

            {q.isFetchNextPageError && (
              <div role="alert" className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
                <span>Couldn't load the next batch. Please try again.</span>
              </div>
            )}

            <div className="mt-10 flex justify-center">
              {q.hasNextPage ? (
                <Button size="lg" variant="poke" onClick={() => q.fetchNextPage()} disabled={q.isFetchingNextPage}>
                  {q.isFetchingNextPage ? <><Loader2 className="animate-spin" /> Loading…</> :
                    q.isFetchNextPageError ? <><RotateCw /> Retry loading</> : <>Load {PAGE_SIZE} more Pokémon</>}
                </Button>
              ) : (
                <p className="text-muted-foreground">You've caught 'em all!</p>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        Data from <a className="font-medium text-foreground underline-offset-4 hover:underline" href="https://pokeapi.co/" target="_blank" rel="noreferrer">PokéAPI</a>. Pokémon © Nintendo / Game Freak.
      </footer>

      <PokemonDetailDialog pokemon={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">{children}</div>;
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">Couldn't reach the Pokédex</h2>
      <p className="mt-1 max-w-sm text-muted-foreground">{message}</p>
      <Button variant="poke" className="mt-6" onClick={onRetry}><RotateCw /> Try again</Button>
    </div>
  );
}
