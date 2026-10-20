import type { TrafficSignal } from '../domain/signals';
import { provincialSignalScope } from '../content/signals';

function SignalDrawing({ signal }: { signal: TrafficSignal }) {
  const { shape, symbol, description } = signal.recognition;
  const shapeElement = shape === 'diamond'
    ? <path d="M60 5 115 60 60 115 5 60Z" fill="#f7d64a" stroke="#202927" strokeWidth="4" />
    : shape === 'octagon'
      ? <path d="M37 5h46l32 32v46l-32 32H37L5 83V37Z" fill="#d92f2d" stroke="#fff" strokeWidth="4" />
      : shape === 'circle'
        ? <circle cx="60" cy="60" r="52" fill="#fff" stroke="#d92f2d" strokeWidth="8" />
        : signal.code === 'R.28'
          ? <path d="M6 12h108L60 110Z" fill="#fff" stroke="#d92f2d" strokeWidth="7" strokeLinejoin="round" />
          : <path d="M60 5 115 108H5Z" fill="#fff" stroke="#d92f2d" strokeWidth="7" strokeLinejoin="round" />;

  let symbolElement;
  switch (symbol) {
    case 'train':
      symbolElement = <g fill="#202927"><rect x="37" y="43" width="42" height="29" rx="3"/><rect x="43" y="34" width="25" height="12"/><rect x="69" y="28" width="7" height="13"/><path d="M32 73h57l-8 8H40Z"/><circle cx="45" cy="83" r="5"/><circle cx="76" cy="83" r="5"/><rect x="43" y="49" width="12" height="9" fill="#fff"/><rect x="61" y="49" width="12" height="9" fill="#fff"/></g>;
      break;
    case 'curve-left':
      symbolElement = <path d="M78 88V55c0-13-9-22-22-22H42m0 0 12-12M42 33l12 12" fill="none" stroke="#202927" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>;
      break;
    case 'pedestrian':
      symbolElement = <g fill="none" stroke="#202927" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"><circle cx="64" cy="34" r="7" fill="#202927"/><path d="m60 44-8 20 16 8-12 19m4-46 14 13 12 1m-24 13-17 4-10 15m28-9 17 12"/><path d="M30 93h60" strokeWidth="3"/></g>;
      break;
    case 'narrowing':
      symbolElement = <path d="M36 87 48 33m36 54L72 33" fill="none" stroke="#202927" strokeWidth="8" strokeLinecap="round"/>;
      break;
    case 'bump':
      symbolElement = <path d="M25 82h15c7 0 7-22 20-22s13 22 20 22h15" fill="none" stroke="#202927" strokeWidth="8" strokeLinecap="round"/>;
      break;
    case 'roundabout':
      symbolElement = <text x="60" y="82" textAnchor="middle" fontSize="58" fontWeight="700" fill="#202927">↻</text>;
      break;
    case 'no-advance':
      symbolElement = <g><path d="M60 82V40m0 0L43 57m17-17 17 17" fill="none" stroke="#202927" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/><path d="M28 28 92 92" stroke="#d92f2d" strokeWidth="9"/></g>;
      break;
    case 'no-entry':
      symbolElement = <rect x="27" y="51" width="66" height="18" rx="2" fill="#d92f2d"/>;
      break;
    case 'no-left-turn':
      symbolElement = <g><path d="M80 83V61c0-12-8-20-20-20H40m0 0 13-13M40 41l13 13" fill="none" stroke="#202927" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/><path d="m27 94 66-68" stroke="#d92f2d" strokeWidth="9"/></g>;
      break;
    case 'no-overtake':
      symbolElement = <g fill="#202927"><path d="M27 69h31l-5-12H34zM61 69h31l-5-12H68z"/><rect x="24" y="69" width="38" height="12" rx="4"/><rect x="58" y="69" width="38" height="12" rx="4"/><circle cx="34" cy="83" r="5"/><circle cx="52" cy="83" r="5"/><circle cx="68" cy="83" r="5"/><circle cx="86" cy="83" r="5"/></g>;
      break;
    case 'speed-limit':
      symbolElement = <text x="60" y="73" textAnchor="middle" fontSize="34" fontWeight="800" fill="#202927">40</text>;
      break;
    case 'stop':
      symbolElement = <text x="60" y="69" textAnchor="middle" fontSize="23" fontWeight="800" fill="#fff">PARE</text>;
      break;
    case 'yield':
      symbolElement = <text x="60" y="61" textAnchor="middle" fontSize="14" fontWeight="800" fill="#202927">CEDA EL</text>;
      break;
  }

  return <svg className={`signal-drawing signal-${shape}`} viewBox="0 0 120 120" role="img" aria-label={`${signal.code} ${signal.name}: ${description}`}>{shapeElement}{symbolElement}</svg>;
}

function SignalGroup({ title, signals }: { title: string; signals: TrafficSignal[] }) {
  return <section className="signal-group" aria-labelledby={`signals-${title}`}>
    <h3 id={`signals-${title}`}>{title} <span>({signals.length})</span></h3>
    <div className="signal-grid">
      {signals.map((signal) => <article className="signal-card" key={signal.id}>
        <div className="signal-card-heading"><SignalDrawing signal={signal}/><div><p className="signal-code">{signal.code}</p><h4>{signal.name}</h4></div></div>
        <p><strong>Reconocimiento:</strong> {signal.recognition.description}</p>
        <p><strong>Significado:</strong> {signal.meaning}</p>
        <p className="signal-legal"><strong>{signal.signalClass === 'reglamentaria' ? 'Obligación:' : 'Conducta:'}</strong> {signal.legalEffect}</p>
        <div className="signal-source"><a href={signal.source.url} target="_blank" rel="noreferrer">Fuente: {signal.source.title}</a><span>{signal.source.reference}</span></div>
      </article>)}
    </div>
  </section>;
}

export function SignalCatalog({ signals }: { signals: TrafficSignal[] }) {
  const warnings = signals.filter((signal) => signal.signalClass === 'advertencia');
  const regulations = signals.filter((signal) => signal.signalClass === 'reglamentaria');

  return <section className="signal-catalog" aria-labelledby="signal-catalog-title">
    <h2 id="signal-catalog-title">Catálogo de señales</h2>
    <p>Primero reconocé la forma, el color y el símbolo. Las preventivas anuncian riesgos; las reglamentarias transmiten órdenes de cumplimiento obligatorio. Los dibujos son representaciones esquemáticas para estudiar, no reproducciones a escala.</p>
    <div className="signal-scope"><strong>Alcance Provincia de Buenos Aires:</strong> {provincialSignalScope.text} <a href={provincialSignalScope.source.url} target="_blank" rel="noreferrer">{provincialSignalScope.source.title}</a></div>
    <SignalGroup title="Señales de advertencia" signals={warnings}/>
    <SignalGroup title="Señales reglamentarias" signals={regulations}/>
  </section>;
}
