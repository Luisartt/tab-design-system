import React from 'react';
export function Input({ label, helper, error, disabled = false, id, type = 'text', placeholder, value, onChange, style }) {
  const [focus, setFocus] = React.useState(false);
  const uid = React.useMemo(() => id || 'in-' + Math.random().toString(36).slice(2, 7), [id]);
  const border = error ? '1.5px solid #B4530A' : focus ? '1.5px solid #0F75BC' : '1.5px solid #B9C4D8';
  return (
    <div style={{ fontFamily: 'var(--font-cuerpo)', display: 'grid', gap: 6, ...style }}>
      {label && <label htmlFor={uid} style={{ fontWeight: 700, fontSize: 13.5, color: '#181C4D' }}>{label}</label>}
      <input id={uid} type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ fontFamily: 'var(--font-cuerpo)', fontSize: 15, color: error ? '#B4530A' : '#181C4D', padding: '11px 14px',
          borderRadius: 'var(--radio-input)', border, outline: 'none',
          background: disabled ? '#EFEEF3' : error ? '#FFF7F0' : '#fff',
          boxShadow: focus && !error ? 'var(--anillo-foco-input)' : 'none', transition: 'border-color .15s, box-shadow .15s' }} />
      {(error || helper) && <div style={{ fontSize: 12, lineHeight: 1.4, color: error ? '#B4530A' : '#4A5578' }}>{error || helper}</div>}
    </div>
  );
}
