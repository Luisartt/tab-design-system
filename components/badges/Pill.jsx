import React from 'react';
export function Pill({ variant = 'navy', children, style }) {
  const bg = variant === 'blue' ? '#0063B0' : '#181C4D';
  return <span style={{ fontFamily: 'var(--font-cuerpo)', fontWeight: 800, fontSize: 12.5, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: bg, padding: '6px 14px', borderRadius: 'var(--radio-pill)', display: 'inline-block', lineHeight: 1.4, ...style }}>{children}</span>;
}
