import type { ScenarioConfig } from '../domain/scenario';

export function ScenarioIllustration({ scenario }: { scenario: ScenarioConfig }) {
  return (
    <figure className="scenario-illustration">
      <svg viewBox="0 0 640 280" role="img" aria-labelledby="scenario-illustration-title">
        <title id="scenario-illustration-title">{scenario.visual.label}</title>
        <rect width="640" height="280" fill="#e7f1f3" />
        <path d="M0 145h640v135H0z" fill="#b9d9a5" />
        <path d="M200 280 265 132h110l65 148z" fill="#454d50" />
        <path d="m306 270 8-28h12l8 28m-18-49 6-21h8l6 21m-14-42 4-15h4l4 15" fill="none" stroke="#f7f5e9" strokeWidth="5" />

        {scenario.visual.kind === 'speed-bump' && <>
          <path d="M275 178q45-43 90 0" fill="none" stroke="#e3b638" strokeWidth="14" />
          <path d="M286 169 300 178m24-22 8 12m17-7 8 13" stroke="#263238" strokeWidth="5" />
          <path d="M495 62 538 136h-86z" fill="#fff9e8" stroke="#c93431" strokeWidth="8" />
          <path d="M470 116q23-28 46 0" fill="none" stroke="#263238" strokeWidth="6" />
        </>}

        {scenario.visual.kind === 'pedestrian-crossing' && <>
          {[-34, -17, 0, 17, 34].map((offset) => <path key={offset} d={`M${320 + offset} 164h12l7 24h-12z`} fill="#fff" />)}
          <circle cx="506" cy="84" r="12" fill="#263238" />
          <path d="m506 98-9 24 16 5m-16-5-14 16m14-16 12 19" fill="none" stroke="#263238" strokeWidth="7" strokeLinecap="round" />
        </>}

        {(scenario.visual.kind === 'stop-intersection' || scenario.visual.kind === 'traffic-light' || scenario.visual.kind === 'priority-intersection') && <>
          <path d="M0 108h640v42H0z" fill="#454d50" />
          <path d="M0 129h250m140 0h250" stroke="#f7f5e9" strokeWidth="4" strokeDasharray="18 14" />
          <path d="M262 145h116v8H262z" fill="#fff" />
        </>}

        {scenario.visual.kind === 'stop-intersection' && <>
          <path d="M505 61 524 55 541 67 547 86 541 105 524 117 505 111 493 94 493 78z" fill="#c93431" stroke="#fff" strokeWidth="4" />
          <text x="520" y="91" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="800">PARE</text>
        </>}

        {scenario.visual.kind === 'traffic-light' && <>
          <path d="M510 55v95" stroke="#59645f" strokeWidth="8" />
          <rect x="489" y="57" width="42" height="91" rx="9" fill="#202927" />
          <circle cx="510" cy="77" r="10" fill="#f04438" />
          <circle cx="510" cy="102" r="10" fill="#66706b" />
          <circle cx="510" cy="127" r="10" fill="#66706b" />
          {[-34, -17, 0, 17, 34].map((offset) => <path key={offset} d={`M${320 + offset} 164h12l7 24h-12z`} fill="#fff" />)}
        </>}

        {scenario.visual.kind === 'priority-intersection' && <>
          <path d="M513 77h58v28h-58z" fill="#2878a8" />
          <path d="M526 64h31v16h-31z" fill="#b9d9e8" />
          <circle cx="527" cy="108" r="8" fill="#202927" />
          <circle cx="558" cy="108" r="8" fill="#202927" />
        </>}
      </svg>
      <figcaption>Ilustración educativa: {scenario.visual.label}. Observá la vía y la señal antes de elegir.</figcaption>
    </figure>
  );
}
