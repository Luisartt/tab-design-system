import React from 'react';
export function TestimonialCard({ variant = 'light', quote, name, company, initials, style }) {
  const navy = variant === 'navy';
  const ini = initials || (name || '').split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: navy ? '#0A153C' : '#fff', border: navy ? 'none' : '1.5px solid #DBE8F2', borderRadius: 'var(--radio-tarjeta)', boxShadow: 'var(--sombra-reposo)', padding: '26px 28px', fontFamily: 'var(--font-cuerpo)', maxWidth: 420, ...style }}>
      {navy && <div style={{ position: 'absolute', top: 0, right: 0, width: 54, height: 54, background: '#F78F3F', clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }}></div>}
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, lineHeight: .6, color: '#F78F3F' }}>{'“'}</div>
      <p style={{ fontFamily: 'var(--font-editorial)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.65, color: navy ? '#fff' : '#181C4D', margin: '10px 0 16px' }}>{quote}</p>
      <div style={{ width: 48, height: 2.5, background: navy ? '#F78F3F' : '#1A60AD', marginBottom: 16 }}></div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0F75BC', border: navy ? '2px solid #F78F3F' : 'none', color: '#fff', fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ini}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: navy ? '#fff' : '#181C4D' }}>{name}</div>
          <div style={{ fontWeight: 600, fontSize: 13, color: navy ? '#9DD4E8' : '#4A5578' }}>{company}</div>
        </div>
      </div>
    </div>
  );
}
