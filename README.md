# scentspace

Built with Vue3, Vite, Pinia, Supabase and ❤️

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Vite

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Lint and Auto-Fix Code with ESLint

```sh
npm run lint
npm run lint:fix
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### create `.env` with supabase credentials

```dotenv
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]
```
