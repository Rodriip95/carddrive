'use client';

import { useState } from 'react';

const checks = [
  {
    id: 'conductor',
    title: 'Prepará a quien conduce',
    review: 'Confirmá que estás descansado, alerta y sin haber consumido alcohol ni sustancias que afecten la conducción. Revisá si algún medicamento produce sueño.',
    reason: 'El cansancio y las sustancias reducen la atención y el tiempo para reaccionar ante un imprevisto.',
  },
  {
    id: 'neumaticos',
    title: 'Revisá neumáticos y rueda de auxilio',
    review: 'Controlá la presión según el manual del vehículo y observá que no haya cortes, deformaciones u otros daños visibles. Verificá también la rueda de auxilio.',
    reason: 'Los neumáticos en buen estado ayudan a conservar adherencia, estabilidad y capacidad de frenado.',
  },
  {
    id: 'luces',
    title: 'Comprobá luces y señales',
    review: 'Verificá luces de posición, bajas, altas, freno, marcha atrás e indicadores de giro. Asegurate de que las placas estén visibles.',
    reason: 'Las luces te permiten ver y hacen que otros usuarios detecten el vehículo y anticipen tus maniobras.',
  },
  {
    id: 'frenos-direccion',
    title: 'Prestá atención a frenos y dirección',
    review: 'Observá si hay testigos de avería, pérdidas visibles o cambios inusuales en el funcionamiento. Ante una falla, no inicies el viaje y consultá un taller.',
    reason: 'Ambos sistemas son necesarios para controlar la trayectoria y detener el vehículo.',
  },
  {
    id: 'visibilidad',
    title: 'Asegurá buena visibilidad',
    review: 'Limpiá los vidrios y espejos; comprobá limpiaparabrisas y lavaparabrisas. Regulá asiento, apoyacabezas y espejos antes de salir.',
    reason: 'Un campo visual despejado te ayuda a detectar riesgos y mantener una postura de manejo segura.',
  },
  {
    id: 'fluidos',
    title: 'Controlá los niveles indicados por el fabricante',
    review: 'Revisá aceite, refrigerante y líquido limpiaparabrisas como indica el manual. Para comprobar el refrigerante, esperá a que el motor esté frío.',
    reason: 'Los niveles adecuados ayudan al funcionamiento del motor y a conservar la visibilidad.',
  },
  {
    id: 'ocupantes',
    title: 'Acomodá y protegé a todas las personas',
    review: 'Confirmá que cada ocupante tenga un cinturón disponible y colocado. Para niñas y niños, usá el sistema de retención apropiado y ubicá a menores de 10 años en el asiento trasero.',
    reason: 'El cinturón y el sistema de retención infantil reducen lesiones en una frenada brusca o un siniestro.',
  },
  {
    id: 'documentos-equipo',
    title: 'Prepará documentación y equipo de emergencia',
    review: 'Llevá licencia vigente, cédula del vehículo y seguro vigente; verificá RTO/VTV según corresponda en tu jurisdicción. Comprobá matafuego y balizas portátiles.',
    reason: 'La documentación debe estar disponible para circular y el equipo ayuda a responder ante una detención imprevista.',
  },
  {
    id: 'recorrido',
    title: 'Planificá el recorrido y el descanso',
    review: 'Consultá el estado del camino y el clima, configurá la navegación antes de arrancar y planificá pausas en viajes largos.',
    reason: 'Anticipar el recorrido reduce distracciones y permite adaptar el viaje a las condiciones.',
  },
];

export function PreDriveChecklist() {
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const pending = checks.length - checkedIds.length;

  function toggleCheck(id: string) {
    setCheckedIds((current) => current.includes(id)
      ? current.filter((checkedId) => checkedId !== id)
      : [...current, id]);
  }

  function resetChecks() {
    setCheckedIds([]);
  }

  return (
    <section className="pre-drive-checklist" aria-labelledby="pre-drive-title">
      <p className="eyebrow">ACTIVIDAD INTERACTIVA</p>
      <h2 id="pre-drive-title">Checklist previo a circular</h2>
      <p className="pre-drive-intro">Marcá cada punto después de revisarlo en el vehículo. Podés recorrer la lista con teclado, mouse o pantalla táctil.</p>

      <div className="pre-drive-progress" aria-live="polite">
        <div>
          <strong>{pending === 0 ? 'Revisión completada' : `${pending} ${pending === 1 ? 'comprobación pendiente' : 'comprobaciones pendientes'}`}</strong>
          <span>{checkedIds.length} de {checks.length} revisadas</span>
        </div>
        <progress value={checkedIds.length} max={checks.length} aria-label="Progreso de comprobaciones" />
      </div>

      <ol className="pre-drive-list">
        {checks.map((check, index) => {
          const checked = checkedIds.includes(check.id);
          return (
            <li className={`pre-drive-item${checked ? ' is-checked' : ''}`} key={check.id}>
              <label className="pre-drive-check">
                <input type="checkbox" checked={checked} onChange={() => toggleCheck(check.id)} />
                <span className="pre-drive-number" aria-hidden="true">{index + 1}</span>
                <span className="pre-drive-title">{check.title}</span>
              </label>
              <p><strong>Qué revisar:</strong> {check.review}</p>
              <p><strong>Por qué:</strong> {check.reason}</p>
            </li>
          );
        })}
      </ol>

      <div className={`pre-drive-summary${pending === 0 ? ' is-complete' : ''}`} role="status" aria-live="polite">
        {pending === 0
          ? 'Completaste la lista. Si encontraste una falla que afecta la seguridad, no circules hasta resolverla.'
          : `Antes de iniciar, revisá los ${pending} ${pending === 1 ? 'punto pendiente' : 'puntos pendientes'} y resolvé cualquier falla que afecte la seguridad.`}
      </div>

      <button className="secondary-button pre-drive-reset" type="button" onClick={resetChecks} disabled={checkedIds.length === 0}>
        Reiniciar checklist
      </button>

      <div className="answer-source pre-drive-sources">
        <strong>Fuentes oficiales</strong>
        <a href="https://www.argentina.gob.ar/sites/default/files/ansv_licencias_manual_del_conductor.pdf" target="_blank" rel="noreferrer">Manual del Conductor — Agencia Nacional de Seguridad Vial</a>
        <a href="https://www.argentina.gob.ar/seguridadvial/licencianacional/documentacion" target="_blank" rel="noreferrer">Documentación y elementos para circular — Argentina.gob.ar</a>
        <a href="https://www.argentina.gob.ar/normativa/nacional/ley-24449-818/actualizacion" target="_blank" rel="noreferrer">Ley Nacional de Tránsito 24.449 — texto actualizado</a>
      </div>
    </section>
  );
}
