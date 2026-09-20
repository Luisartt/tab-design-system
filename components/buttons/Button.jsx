import React from 'react';
export function Button({ variant = 'primary', disabled = false, href, onClick, children, style }) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const V = {
    primary:   { bg: '#0F75BC', bgH: '#0063B0', bgA: '#002F5A', fg: '#fff', fgH: '#fff' },
    secondary: { bg: 'transparent', bgH: '#DBE8F2', bgA: '#DBE8F2', fg: '#0F75BC', fgH: '#0F75BC', border: '2px solid #0F75BC' },
    cta:       { bg: '#F78F3F', bgH: '#F08921', bgA: '#D97714', fg: '#181C4D', fgH: '#181C4D', weight: 800 },
    white:     { bg: '#fff', bgH: '#EFEEF3', bgA: '#DBE8F2', fg: '#181C4D', fgH: '#181C4D' },
    ghost:     { bg: 'transparent', bgH: 'rgba(255,255,255,.08)', bgA: 'rgba(255,255,255,.14)', fg: '#fff', fgH: '#fff', border: '2px solid rgba(255,255,255,.55)', borderH: '2px solid #fff' }
  }[variant === 'link' ? 'primary' : variant];
  if (variant === 'link') {
    const s = { fontFamily: 'var(--font-cuerpo)', fontWeight: 700, fontSize: 16, color: hover ? '#0F75BC' : '#0063B0', textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none', padding: 0, display: 'inline-flex', alignItems: 'center', gap: 6, ...style };
    const T = href ? 'a' : 'button';
    return React.createElement(T, { href, onClick, style: s, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) }, children, ' →');
  }
  const s = {
    fontFamily: 'var(--font-cuerpo)', fontWeight: V.weight || 700, fontSize: 16, lineHeight: 1.2,
    minHeight: 44, padding: '10px 22px', borderRadius: 'var(--radio-boton)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    border: (hover && V.borderH) || V.border || 'none',
    background: disabled ? '#EFEEF3' : active ? V.bgA : hover ? V.bgH : V.bg,
    color: disabled ? '#8A93B0' : hover ? V.fgH : V.fg,
    cursor: disabled ? 'default' : 'pointer', textDecoration: 'none',
    transition: 'background .15s, color .15s, border-color .15s',
    boxShadow: focus && !disabled ? 'var(--anillo-foco)' : 'none', outline: 'none', ...style
  };
  const T = href && !disabled ? 'a' : 'button';
  return React.createElement(T, {
    href, onClick: disabled ? undefined : onClick, disabled: T === 'button' ? disabled : undefined, style: s,
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setActive(false); },
    onMouseDown: () => setActive(true), onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true), onBlur: () => setFocus(false)
  }, children);
}
