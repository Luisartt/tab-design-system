import React from 'react';
export function SCurveDivider({ fill = '#0A153C', stroke = true, strokeWidth = 5, height = 110, style }) {
  return (
    <svg viewBox="0 0 1440 110" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height, ...style }} aria-hidden="true">
      <path d="M0,86 C420,132 900,-14 1440,52 L1440,110 L0,110 Z" fill={fill} />
      {stroke && <path d="M0,86 C420,132 900,-14 1440,52" fill="none" stroke="#1A60AD" strokeWidth={strokeWidth} />}
    </svg>
  );
}
