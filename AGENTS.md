# Repository Guidelines

## Idioma y aprendizaje

Responde siempre en español. El objetivo es aprender Three.js: explica brevemente qué cambia, por qué y los conceptos utilizados. Escribe comentarios nuevos en español y conserva los nombres de las API. Prioriza ejemplos sencillos y cambios pequeños, sin abstracciones ni dependencias innecesarias.

## Project Structure & Module Organization

El proyecto usa Next.js App Router, React, TypeScript, Three.js y React Three Fiber. `src/app/` contiene las rutas y metadatos SEO; `src/content/modules.ts` define el catálogo educativo; `src/domain/` contiene los modelos y validadores independientes de la interfaz. `src/components/` contiene las partes interactivas, incluida la escena R3F. `src/scene/` conserva la lógica Three.js existente para reutilizarla y migrarla gradualmente. Los modelos glTF/GLB servidos directamente por Next.js están en `public/models/`; otras imágenes y recursos fuente permanecen en `src/assets/`.

Keep original/imported assets in `src/assets/` and files served directly by URL in `public/`. TypeScript configuration lives in `tsconfig.json`. Next.js production output is generated in `.next/`. There is currently no test directory.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from the committed lockfile when available.
- `npm run dev`: start the Next.js development server with live updates.
- `npm run build`: run the optimized Next.js production build and TypeScript checks.
- `npm start`: serve the production build locally after building.

## Coding Style & Naming Conventions

Use two-space indentation, ES module imports, and single-quoted TypeScript strings. Follow the surrounding file's semicolon style; `src/main.ts` uses semicolons. Use `camelCase` for variables and functions, `PascalCase` for classes and types, and descriptive asset names.

No ESLint or Prettier configuration is present. TypeScript checks unused locals, unused parameters, and switch fallthrough. Keep new modules focused as scene complexity grows.

## Testing Guidelines

No automated test framework, `npm test` script, coverage threshold, or test naming convention is configured. Run `npm run build` before submitting changes. For rendering changes, check the scene in a browser: confirm animation, lighting, canvas sizing after window resize, and absence of console errors. Verify any newly loaded assets resolve correctly.

## Commit & Pull Request Guidelines

Git history is unavailable in this workspace, so existing commit conventions cannot be verified. Prefer concise, imperative commit messages, such as `Fix camera aspect ratio on resize`.

Pull requests should describe the change, list validation performed, and link relevant issues. Include screenshots or a short recording for visual or animation changes. Keep generated bundles and `node_modules/` out of commits; update `package-lock.json` alongside dependency changes.




<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
