# Repository Guidelines

## Idioma y aprendizaje

Responde siempre en español. El objetivo es aprender Three.js: explica brevemente qué cambia, por qué y los conceptos utilizados. Escribe comentarios nuevos en español y conserva los nombres de las API. Prioriza ejemplos sencillos y cambios pequeños, sin abstracciones ni dependencias innecesarias.

## Project Structure & Module Organization

El proyecto usa Vite, TypeScript y Three.js, sin framework de interfaz. `index.html` es la entrada del navegador y `src/main.ts` inicia la aplicación. `src/scene/app.ts` coordina la carga, el renderizado y el tamaño de ventana; `world.ts` crea la escena y las luces; `camera.ts` calcula el encuadre; `car.ts` carga el modelo y expone `update(delta, roadSpeed)`; `lane-change.ts` calcula los cambios suaves entre carriles y `road.ts` anima la carretera. `src/ui/` contiene los controles de velocidad y carril. La cámara acompaña la posición del auto. Los parámetros de cámara y movimiento están en `src/scene/config.ts`. `src/style.css` define el canvas y los mensajes de estado.

Keep imported images, SVGs, and 3D models in `src/assets/`; use `public/` for static files served directly. TypeScript configuration lives in `tsconfig.json`. Production output is generated in `dist/`. There is currently no test directory.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from the committed lockfile when available.
- `npm run dev`: start the Vite development server with live updates.
- `npm run build`: run TypeScript checks and generate the production bundle in `dist/`.
- `npm run preview`: serve the production bundle locally after building.

## Coding Style & Naming Conventions

Use two-space indentation, ES module imports, and single-quoted TypeScript strings. Follow the surrounding file's semicolon style; `src/main.ts` uses semicolons. Use `camelCase` for variables and functions, `PascalCase` for classes and types, and descriptive asset names.

No ESLint or Prettier configuration is present. TypeScript checks unused locals, unused parameters, and switch fallthrough. Keep new modules focused as scene complexity grows.

## Testing Guidelines

No automated test framework, `npm test` script, coverage threshold, or test naming convention is configured. Run `npm run build` before submitting changes. For rendering changes, check the scene in a browser: confirm animation, lighting, canvas sizing after window resize, and absence of console errors. Verify any newly loaded assets resolve correctly.

## Commit & Pull Request Guidelines

Git history is unavailable in this workspace, so existing commit conventions cannot be verified. Prefer concise, imperative commit messages, such as `Fix camera aspect ratio on resize`.

Pull requests should describe the change, list validation performed, and link relevant issues. Include screenshots or a short recording for visual or animation changes. Keep generated bundles and `node_modules/` out of commits; update `package-lock.json` alongside dependency changes.



