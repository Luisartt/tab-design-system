function StratProPost() {
  const { ProcessDiagram } = window.TABDesignSystem_018620 || {};
  const ph = (label) => (
    <div style={{ position: 'absolute', inset: 0, background: '#DBE8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5578', fontWeight: 600, fontSize: 15, textAlign: 'center', padding: 12 }}>{label}</div>
  );
  return (
    <div style={{ position: 'relative', width: 1080, height: 1080, background: '#0A153C', overflow: 'hidden', fontFamily: 'var(--font-cuerpo)' }}>
      <div style={{ position: 'absolute', right: 62, top: 96, bottom: 64, width: 12, background: '#F08921' }}></div>
      <div style={{ position: 'absolute', right: 62, top: 96, width: 420, height: 12, background: '#F08921' }}></div>
      <div style={{ position: 'absolute', left: 540, top: 20, width: 470, height: 470, background: '#002F5A', transform: 'rotate(45deg)', transformOrigin: 'center' }}></div>
      <div style={{ position: 'absolute', left: 470, top: 130, width: 610, textAlign: 'center', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 58, letterSpacing: '.02em' }}>STRAT<span style={{ color: '#F78F3F' }}>PRO</span></div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, letterSpacing: '.3em', marginTop: 18 }}>BROUGHT TO YOU BY</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 54, marginTop: 14 }}>TAB</div>
        <div style={{ fontWeight: 600, fontSize: 14, letterSpacing: '.28em', marginTop: 6 }}>THE ALTERNATIVE BOARD</div>
      </div>
      <div style={{ position: 'absolute', left: 64, top: 78, width: 380, fontFamily: 'var(--font-editorial)', fontWeight: 400, fontSize: 44, lineHeight: 1.4, color: '#fff' }}>Strategy matters, but alignment is what turns strategy into movement.</div>
      <div style={{ position: 'absolute', left: 14, bottom: 56 }}>
        <ProcessDiagram size={520}>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 26, color: '#181C4D', lineHeight: 1.05 }}>STRAT<br /><span style={{ color: '#F08921' }}>PRO</span></div>
        </ProcessDiagram>
      </div>
      <div style={{ position: 'absolute', right: 96, top: 470, width: 300, height: 200, overflow: 'hidden' }}>{ph('Foto real: manos + engranes')}</div>
      <div style={{ position: 'absolute', right: 116, bottom: 88, width: 380, height: 300, overflow: 'hidden', border: '1px solid rgba(255,255,255,.2)' }}>{ph('Foto real: junta de equipo')}</div>
    </div>
  );
}
window.StratProPost = StratProPost;
