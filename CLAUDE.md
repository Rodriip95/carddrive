# CLAUDE.md

Guía de contexto para Claude Code. Complementa `AGENTS.md` (idioma, estilo y convenciones: léelo primero).

## Objetivo del producto

"A conducir": app educativa en español rioplatense para aprender normas de tránsito argentinas (señales, reglas de circulación, conducción segura, conocimiento del vehículo) con un simulador 3D. Meta actual: **gamificar** el aprendizaje. El contenido cita fuentes oficiales (Ley 24.449, Decreto 779/1995 Anexo L, Manual del Conductor ANSV).

## Comandos

- `npm run dev`: servidor de desarrollo.
- `npm run build`: build de producción (usa `next build --webpack`) y chequeo de TypeScript. Es la única verificación automática; no hay tests ni linter.
- Next.js 16 tiene cambios incompatibles: consultar `node_modules/next/dist/docs/` antes de tocar APIs de Next.

## Arquitectura (capas)

- `src/content/`: datos puros. `modules.ts` (4 módulos), `questions.ts` (23 preguntas), `signals.ts` (catálogo de señales, SVG en `public/assets/svg/`), `scenarios.ts` (5 escenarios de conducción, cada uno con una `action` a ejecutar). Cada módulo tiene `mode`: `'preguntas'` (lección con tarjetas) o `'simulador'` (se aprende en `/practica?modulo=<id>`; hoy solo `normas`).
- `src/domain/`: modelos y lógica sin UI ni Three.js. `learning.ts` (tipos), `validation.ts`, `learning-points.ts` (10 puntos por pregunta correcta), `scenario-controller.ts` (máquina de estados `inicio → conduciendo → pausa | decision → resultado`, patrón subscribe + `useSyncExternalStore`), `scenario.ts` (`ScenarioConfig`).
- `src/scene/`: Three.js imperativo heredado de un proyecto Vite. `createDrivingExperience()` en `app.ts` arma auto, ruta, tráfico, colisiones, cámara y el objeto del escenario (`scenario-object.ts`).
- `src/components/three/driving-scene.tsx`: puente R3F. Crea la experiencia en un efecto y la actualiza con `useFrame`.
- `src/components/practice-experience.tsx`: orquestador de `/practica` (modo 3D y modo "sin 3D" si no hay WebGL 2 o falla la carga).
- `src/services/progress-repository.ts` + `components/ProgressProvider.tsx`: progreso en localStorage con envoltorio versionado (`PROGRESS_SCHEMA_VERSION`). Un cambio de forma de datos exige migración.
- Rutas: `/`, `/lecciones/[id]`, `/evaluacion`, `/practica`.
- Modelo 3D en `public/models/car.glb`.

## Flujo del simulador

1. El auto avanza solo; a `decisionDistance` del objeto del escenario se emite `onDecisionReady` y el controlador presenta la decisión (multiple choice, 3 opciones).
2. Opción incorrecta: `resolveDecision(false)` aplica el impacto y se muestra la explicación.
3. Opción correcta con `decision.action`: el estado pasa a `accion` y el usuario **debe ejecutarla** con el auto (`stop-before-line` o `slow-to`). `createDrivingExperience().beginAction()` la evalúa en cada paso de `update()` y devuelve `actionResult` (`success`/`failure`); el controlador pasa a `resultado` con `failure: 'accion'` si no se cumplió.
4. Controles dentro de la escena: `components/DrivingHud.tsx` (pedales sostenidos freno/acelerador, volante, cámara, día/noche, pausa) y teclado (flechas/WASD). El pedal es un `ref` (`pedalRef`) que `driving-scene.tsx` lee en `useFrame`; al soltar se mantiene la velocidad actual.
5. En modo módulo (`/practica?modulo=normas`) la práctica sigue `module.scenarioIds` y guarda `completedScenarioIds` (20 puntos por situación) con `recordScenarioCompletion`.
6. Modo "sin 3D": la maniobra se da por cumplida (no se puede manejar).

## Estado y deudas conocidas

- Solo `normas` usa el simulador (3 escenarios). `senales`, `seguridad` y `vehiculo` siguen con preguntas y tienen `scenarioIds: []`. Faltan escenarios nuevos con fuente oficial para migrarlos (el checklist previo de `vehiculo` no encaja en la ruta).
- El tráfico (camión/colectivo) se quitó; `scene/traffic.ts` y `collisions.ts` quedan listos con `models` vacío para volver a usarlos.
- Banco de preguntas incompleto: 23/50 (ticket KAN-32, ver `docs/KAN-32-auditoria-preguntas.md`). Normas y seguridad tienen 1 pregunta cada una. Toda pregunta nueva necesita `source` y `reviewStatus`.
- `DrivingScenario` (estados/decisiones/eventos) en `learning.ts` no se usa; se usa `ScenarioConfig`. Cada escenario tiene una sola decisión y una sola maniobra.
- Gamificación actual mínima: solo puntos fijos. Faltan niveles, rachas, insignias y desbloqueo de módulos. Esa lógica debería vivir en `src/domain/` como funciones puras.
- Documentación desactualizada: `AGENTS.md` menciona `src/main.ts` (ya no existe); `src/assets/` conserva restos de Vite; `public/assets/` aún no está versionado.
- Sin backend ni cuentas: todo el progreso es local al navegador.

## Reglas al modificar

- Contenido normativo: no inventar. Citar fuente y apartado verificables.
- Mantener datos educativos fuera de los componentes visuales.
- Cambios pequeños y explicados (el objetivo del usuario es aprender Three.js).
