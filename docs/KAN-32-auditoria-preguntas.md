# KAN-32 — Auditoría de preguntas frente a fuentes oficiales

**Fecha:** 20 de octubre de 2026  
**Alcance revisado:** banco disponible en `src/content/questions.ts`  
**Resultado:** 23 preguntas auditadas; el ticket solicita 50. Faltan 27 preguntas en el banco y, por tanto, no se puede declarar completo el criterio de aceptación.

## Método y resultado

Se contrastaron enunciado, opción correcta, explicación, jurisdicción y referencia de cada pregunta existente. Las 23 tienen fuente y apartado identificable; las 23 figuran con `reviewStatus: 'reviewed'` y ninguna está en estado pendiente. No se encontraron dudas normativas que requieran excluir estas preguntas del MVP.

| Pregunta(s) | Fuente oficial y apartado contrastado | Resultado |
| --- | --- | --- |
| `senales-ceda-el-paso` | Decreto 779/1995, Anexo L actualizado, cap. III, punto 11, R.28 | Conforme: se pierde la prioridad general; detenerse no es obligatorio si se asegura el paso prioritario. |
| `senales-no-avanzar`, `senales-contramano`, `senales-no-girar`, `senales-no-retomar`, `senales-no-adelantar`, `senales-no-estacionar`, `senales-no-estacionar-ni-detenerse` | Anexo L actualizado, cap. III, punto 9, R.1, R.2, R.4, R.5, R.6, R.8 y R.9 | Conforme: significados y excepciones descritos en las respuestas coinciden con los incisos aplicables. R.8 admite detención para carga/descarga y ascenso/descenso; R.9 sólo permite detenerse por motivos de circulación. |
| `senales-velocidad-maxima` | Anexo L actualizado, cap. III, punto 10, R.15 | Conforme: indica la velocidad máxima en km/h del tramo. |
| `senales-cruce-ferroviario` | Anexo L actualizado, cap. IV, punto 14, P.1 | Conforme: advierte un cruce a nivel y prescribe reducir la velocidad y prestar atención a trenes. |
| `senales-curva-cerrada` | Anexo L actualizado, cap. IV, punto 14, P.4 | Conforme: advierte una curva peligrosa hacia el lado indicado. |
| `senales-estrechamiento` | Anexo L actualizado, cap. IV, punto 15, P.10 | Conforme: anuncia estrechamiento simétrico o de un solo lado. |
| `senales-linea-separacion-sentidos` | Anexo L actualizado, cap. VI, puntos 26 y 27, H.1 y reglas de líneas continuas | Conforme: separa sentidos opuestos y no debe cruzarse ni transitarse sobre ella. |
| `senales-linea-detencion`, `senales-senda-peatonal` | Anexo L actualizado, cap. VI, punto 28, H.4 y H.5 | Conforme: H.4 define los supuestos de detención antes de la línea; H.5 identifica la senda y la prioridad peatonal, sujeta a semáforo o indicación de autoridad competente. |
| `normas-senda-peatonal` | Ley 24.449, texto actualizado, art. 41 inc. e | Conforme con alcance nacional: reconoce prioridad al peatón que cruza lícitamente y exige detenerse si el conductor lo pone en peligro. La pregunta ya indica respetar también señalización y reglas locales. |
| `seguridad-distancia` | Manual del Conductor de la ANSV, cap. 4, §4.2.h, “La distancia de seguridad” | Conforme: recomienda distancia adecuada y ampliarla con visibilidad reducida u otras condiciones adversas. Se corrigió la referencia errónea a §4.2.b y página. |
| `vehiculo-revision-previa` | Manual del Conductor de la ANSV, cap. 2, §2.1.d, y cap. 3, §3.1 | Conforme: las comprobaciones de neumáticos y luces citadas aparecen en las secciones indicadas. Se eliminaron rangos de páginas imprecisos. |
| `vehiculo-neumaticos` | Manual del Conductor de la ANSV, cap. 2, §2.1.d, “Neumáticos” | Conforme: respalda inspección visual, presión adecuada al vehículo y consulta del manual. La pregunta no usa el método casero de la moneda descrito en el manual. |
| `vehiculo-luces` | Manual del Conductor de la ANSV, cap. 3, §3.1, “Revisación general del vehículo” | Conforme: recomienda comprobar luces de freno, intermitentes, emergencia, altas y bajas. |
| `vehiculo-fluidos` | ANSV, “Vamos a la ruta: lo que tenés que saber para viajar con el auto”, revisión mínima previa al viaje | Conforme como orientación educativa: la fuente recomienda verificar niveles de aceite, agua y líquido de frenos; la respuesta evita prescribir productos o procedimientos universales y remite al manual del vehículo. |
| `vehiculo-testigos-advertencia`, `vehiculo-testigo-critico` | Manual del propietario Toyota Argentina, §5-2, luces de aviso | Conforme con alcance limitado al manual citado: distingue avisos y acciones específicas, incluyendo detenerse con seguridad para ciertos avisos críticos. Las preguntas indican seguir el manual del modelo propio; no extrapolan códigos de testigos Toyota a otras marcas. |

## Fuentes consultadas

- [Anexo L actualizado del Decreto 779/1995](https://www.argentina.gob.ar/normativa/recurso/30389/texactdto779-1995-anexoL/htm), sustituido por el Decreto 196/2025 con vigencia desde el 19 de marzo de 2025.
- [Ley 24.449, texto actualizado](https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/actualizacion).
- [Manual del Conductor de la ANSV](https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf).
- [Guía de revisión previa al viaje de la ANSV](https://www.argentina.gob.ar/noticias/vamos-la-ruta-lo-que-tenes-que-saber-para-viajar-con-el-auto).
- [Manual del propietario Toyota Argentina](https://media.toyota.com.ar/0c718245-a700-4546-95b2-b45c22bda4c6.pdf), referencia específica del fabricante; para conducción real prevalece el manual del modelo propio.

## Pendiente para completar KAN-32

El banco contiene **23/50** preguntas: señales (15), normas (1), seguridad (1) y vehículo (6). **Faltan 27 preguntas**; no se pueden auditar ni publicar como revisadas hasta que existan. KAN-32 debe permanecer abierto/en curso. Al completar el banco, repetir esta revisión sobre las nuevas preguntas y confirmar su fuente y apartado individualmente.
