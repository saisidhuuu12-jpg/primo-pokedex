const BASE = "https://pokeapi.co/api/v2";
export const PAGE_SIZE = 20;

export interface PokemonSummary {
  id: number;
  name: string;
  types: string[];
  artwork: string | null;
}

export interface PokemonDetail extends PokemonSummary {
  height: number; // decimetres
  weight: number; // hectograms
  baseExperience: number | null;
  abilities: { name: string; hidden: boolean }[];
  stats: { name: string; value: number }[];
}

export interface PokemonPage {
  items: PokemonDetail[];
  nextOffset: number | null;
  total: number;
}

interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { slot: number; type: { name: string } }[];
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: { "official-artwork"?: { front_default: string | null } };
  };
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, signal ? { signal } : undefined);
  if (!res.ok) throw new Error(`PokéAPI request failed (${res.status})`);
  return res.json() as Promise<T>;
}

function mapPokemon(p: RawPokemon): PokemonDetail {
  return {
    id: p.id,
    name: p.name,
    types: [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
    artwork: p.sprites.other?.["official-artwork"]?.front_default ?? p.sprites.front_default,
    height: p.height,
    weight: p.weight,
    baseExperience: p.base_experience,
    abilities: p.abilities.map((a) => ({ name: a.ability.name, hidden: a.is_hidden })),
    stats: p.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  };
}

export async function fetchPokemonPage(offset: number, signal?: AbortSignal): Promise<PokemonPage> {
  const list = await getJson<{ count: number; next: string | null; results: { url: string }[] }>(
    `${BASE}/pokemon?limit=${PAGE_SIZE}&offset=${offset}`,
    signal,
  );
  const items = await Promise.all(
    list.results.map((r) => getJson<RawPokemon>(r.url, signal).then(mapPokemon)),
  );
  return {
    items,
    total: list.count,
    nextOffset: list.next ? offset + PAGE_SIZE : null,
  };
}

export const formatName = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
export const formatId = (id: number) => `#${String(id).padStart(4, "0")}`;
