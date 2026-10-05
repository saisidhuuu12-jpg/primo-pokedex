<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- PokéAPI calls live only in src/lib/pokeapi.ts and are mapped to plain DTOs; UI components never call fetch directly — keeps API logic swappable and testable.
- Pokémon list paging uses a TanStack infinite query (limit=20, offset); search filters loaded pages locally only — preserves the 20-at-a-time requirement.
