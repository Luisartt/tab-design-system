function CaseStudyPost() {
  const { Pill } = window.TABDesignSystem_018620 || {};
  return (
    <div style={{ position: 'relative', width: 1350, height: 700, background: '#EFEEF3', overflow: 'hidden', fontFamily: 'var(--font-cuerpo)' }}>
      <div style={{ position: 'absolute', right: 0, top: 0, width: '46%', height: '100%', background: '#DBE8F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4A5578', fontWeight: 600, fontSize: 17 }}>Foto real: retrato del miembro</div>
      <div style={{ position: 'absolute', left: 52, top: 46 }}><Pill style={{ fontSize: 20, padding: '10px 22px' }}>Case study</Pill></div>
      <div style={{ position: 'absolute', left: 54, top: 122, fontWeight: 800, fontSize: 24, letterSpacing: '.03em', textTransform: 'uppercase', color: '#0063B0' }}>Mike Mayo&nbsp;&nbsp;|&nbsp;&nbsp;Nanohmics</div>
      <div style={{ position: 'absolute', left: 0, top: 190, background: 'rgba(255,255,255,.8)', padding: '30px 40px 34px 54px', fontFamily: 'var(--font-display)', color: '#181C4D' }}>
        <div style={{ fontWeight: 800, fontSize: 60, lineHeight: 1.12 }}>LEADING SMARTER</div>
        <div style={{ fontWeight: 600, fontSize: 54, lineHeight: 1.16, opacity: .92 }}>BY LEARNING TO</div>
        <div style={{ fontWeight: 800, fontSize: 68, lineHeight: 1.1 }}>DELEGATE</div>
      </div>
      <div style={{ position: 'absolute', left: 54, bottom: 44 }}><img src="../../assets/logo/tab-logo-color.png" style={{ width: 230, display: 'block' }} alt="TAB - The Alternative Board" /></div>
    </div>
  );
}
window.CaseStudyPost = CaseStudyPost;
