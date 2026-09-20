import React from 'react';
export function Chip({ tone = 'hielo', children, style }) {
  return <span style={{ fontFamily: 'var(--font-cuerpo)', fontWeight: 600, fontSize: 13, color: '#181C4D', background: tone === 'perla' ? '#EFEEF3' : '#DBE8F2', padding: '5px 12px', borderRadius: 'var(--radio-input)', display: 'inline-block', lineHeight: 1.4, ...style }}>{children}</span>;
}
