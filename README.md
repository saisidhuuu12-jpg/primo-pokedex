# Pokedex Prime

Create a polished, production-ready responsive Pokédex website. Use PokéAPI (https://pokeapi.co/) as the only Pokémon data source. Requirements: 1) Initially fetch and display exactly 20 Pokémon. 2) Implement lazy/paginated loading in batches of exactly 20 using limit=20 and offset; a prominent "Load More" button appends the next 20 without replacing existing cards. 3) Each Pokémon card must be clickable. Clicking opens a polished detail modal/drawer with official artwork, Pokémon name, #ID, types, abilities, height, weight, base experience, and base stats. 4) Add loading skeletons, API error state with retry, empty state, keyboard-accessible cards/buttons, and responsive design. 5) Modern visual design inspired by a premium Pokédex: clean white/light-gray background, subtle red/yellow Pokémon accents, rounded cards, smooth hover/transition effects, strong typography, mobile-first responsive grid. 6) Include a search field that filters the already loaded Pokémon locally; do not let search break the 20-at-a-time requirement. 7) Use TypeScript, React, Tailwind/shadcn where appropriate. Keep API logic clean and componentized. No mock/static Pokémon data. Make it ready for preview and publishing.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://primo-pokedex.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/88c9ad05-b4d9-45fe-a431-d52b05022c02).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
