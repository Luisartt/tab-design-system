import React from 'react';
export function Checkbox({ label, checked, defaultChecked, onChange, disabled = false, style }) {
  return (
    <label style={{ fontFamily: 'var(--font-cuerpo)', fontSize: 15, color: disabled ? '#8A93B0' : '#181C4D', display: 'inline-flex', alignItems: 'center', gap: 10, cursor: disabled ? 'default' : 'pointer', ...style }}>
      <input type="checkbox" checked={checked} defaultChecked={defaultChecked} onChange={onChange} disabled={disabled}
        style={{ accentColor: '#0F75BC', width: 18, height: 18, margin: 0 }} />
      {label}
    </label>
  );
}
