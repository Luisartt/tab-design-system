import React from 'react';
const DEFAULT_STEPS = [
  { name: 'Align', detail: 'Behavior & Communication' },
  { name: 'Vision', detail: 'Vision, Values & Culture' },
  { name: 'Diagnose', detail: 'Diagnostics, SWOT & CSFs' },
  { name: 'Plan', detail: 'Goals, Actions, Strategies & KPIs' },
  { name: 'Execute', detail: 'Priorities, Accountability & Communication' },
  { name: 'Optimize', detail: 'Continuous Review & Revision' }
];
export function ProcessDiagram({ steps = DEFAULT_STEPS, size = 380, children, style }) {
  const n = steps.length, seg = 360 / n;
  const segColors = ['var(--seg-1)', 'var(--seg-2)', 'var(--seg-3)', 'var(--seg-4)', 'var(--seg-5)', 'var(--seg-6)'];
  const conic = steps.map((_, i) => segColors[i % 6] + ' ' + (i * seg) + 'deg ' + ((i + 1) * seg) + 'deg').join(', ');
  const rLabel = size / 2 - 16, rDot = size / 2 - 2, rDetail = size * 0.30, rCenter = size * 0.19;
  return (
    <div style={{ position: 'relative', width: size, height: size, fontFamily: 'var(--font-cuerpo)', ...style }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'conic-gradient(from -30deg, ' + conic + ')' }}></div>
      {steps.map((s, i) => {
        const a = -30 + seg / 2 + i * seg;
        return <div key={'l' + i} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%) rotate(' + a + 'deg) translateY(' + (-rLabel) + 'px)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.037, letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff', whiteSpace: 'nowrap' }}>{s.name}</div>;
      })}
      {steps.map((s, i) => {
        const a = -30 + seg / 2 + i * seg;
        return s.detail ? <div key={'d' + i} style={{ position: 'absolute', left: '50%', top: '50%', width: size * 0.30, marginLeft: size * -0.15, transform: 'rotate(' + a + 'deg) translateY(' + (-rDetail) + 'px) rotate(' + (-a) + 'deg)', textAlign: 'center', fontSize: size * 0.032, lineHeight: 1.35, color: '#fff' }}>{s.detail}</div> : null;
      })}
      {steps.map((_, i) => {
        const a = -30 + i * seg, d = size * 0.075;
        return <div key={'n' + i} style={{ position: 'absolute', left: '50%', top: '50%', width: d, height: d, marginLeft: -d / 2, marginTop: -d / 2, transform: 'rotate(' + a + 'deg) translateY(' + (-rDot + d / 2) + 'px) rotate(' + (-a) + 'deg)', borderRadius: '50%', background: '#F78F3F', border: '2.5px solid #fff', color: '#fff', fontWeight: 800, fontSize: d * 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>;
      })}
      <div style={{ position: 'absolute', left: '50%', top: '50%', width: rCenter * 2, height: rCenter * 2, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: '#fff', border: (size * 0.014) + 'px solid #F08921', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{children}</div>
    </div>
  );
}
