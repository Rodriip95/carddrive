# Aprende a conducir

Aplicación educativa construida con Next.js App Router, React, TypeScript, Three.js y React Three Fiber.

## Desarrollo

- `npm ci`: instala las dependencias fijadas en `package-lock.json`.
- `npm run dev`: inicia Next.js en modo desarrollo.
- `npm run build`: genera la compilación de producción y ejecuta las comprobaciones de TypeScript.
- `npm start`: sirve la compilación de producción.

Se requiere Node.js 20.9 o superior.

## Estructura

- `src/app/`: portada, lecciones estáticas y la ruta interactiva `/practica`.
- `src/content/`: catálogo de módulos.
- `src/domain/`: modelos y validadores del contenido educativo.
- `src/components/three/`: componentes de escena React Three Fiber.
- `src/scene/`: lógica Three.js existente, reutilizada gradualmente durante la migración.
- `src/assets/`: imágenes y otros recursos fuente.
- `public/models/`: modelos glTF/GLB servidos directamente por Next.js.

Las páginas informativas usan Server Components para entregar HTML y metadatos desde el servidor. La práctica 3D es interactiva y usa un Client Component con `<Canvas>`; sus datos educativos permanecen fuera de los componentes visuales.
