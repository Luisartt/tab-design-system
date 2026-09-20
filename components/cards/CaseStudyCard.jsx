import React from 'react';
export function CaseStudyCard({ image, title, tag = 'TAB Case Study', href = '#', linkLabel, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ background: '#fff', border: '1.5px solid #DBE8F2', borderRadius: 'var(--radio-tarjeta)', boxShadow: 'var(--sombra-reposo)', overflow: 'hidden', fontFamily: 'var(--font-cuerpo)', maxWidth: 360, ...style }}>
      <div style={{ position: 'relative', height: 170, background: '#0F75BC' }}>
        {image && <img src={image} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1)', mixBlendMode: 'multiply' }} />}
        <span style={{ position: 'absolute', top: 14, left: 14, fontWeight: 800, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: '#181C4D', padding: '6px 14px', borderRadius: 'var(--radio-pill)' }}>{tag}</span>
      </div>
      <div style={{ padding: '18px 20px 20px' }}>
        <div style={{ fontWeight: 800, fontSize: 19, lineHeight: 1.3, color: '#181C4D', marginBottom: 10 }}>{title}</div>
        <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ fontWeight: 700, fontSize: 15, color: hover ? '#0F75BC' : '#0063B0', textDecoration: 'none' }}>{linkLabel || 'Leer la historia'} {'→'}</a>
      </div>
    </div>
  );
}
