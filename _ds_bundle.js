/* @ds-bundle: {"format":4,"namespace":"TABDesignSystem_018620","components":[{"name":"Chip","sourcePath":"components/badges/Chip.jsx"},{"name":"Pill","sourcePath":"components/badges/Pill.jsx"},{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"CaseStudyCard","sourcePath":"components/cards/CaseStudyCard.jsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"ProcessDiagram","sourcePath":"components/motifs/ProcessDiagram.jsx"},{"name":"SCurveDivider","sourcePath":"components/motifs/SCurveDivider.jsx"}],"sourceHashes":{"components/badges/Chip.jsx":"905369839711","components/badges/Pill.jsx":"fa5513f44d21","components/buttons/Button.jsx":"6bbab9c28836","components/cards/CaseStudyCard.jsx":"bcdecb3aa70a","components/cards/TestimonialCard.jsx":"314f6ebe5092","components/forms/Checkbox.jsx":"6ee6a07043a4","components/forms/Input.jsx":"1427cfb3422b","components/forms/Radio.jsx":"ce1d5d389ed1","components/motifs/ProcessDiagram.jsx":"c4176ea7f05d","components/motifs/SCurveDivider.jsx":"49f3c4c6f29d","ui_kits/social/CaseStudyPost.jsx":"c991a2a37f47","ui_kits/social/StratProPost.jsx":"06223abd9a62"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.TABDesignSystem_018620 = window.TABDesignSystem_018620 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/badges/Chip.jsx
try { (() => {
function Chip({
  tone = 'hielo',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-cuerpo)',
      fontWeight: 600,
      fontSize: 13,
      color: '#181C4D',
      background: tone === 'perla' ? '#EFEEF3' : '#DBE8F2',
      padding: '5px 12px',
      borderRadius: 'var(--radio-input)',
      display: 'inline-block',
      lineHeight: 1.4,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/Chip.jsx", error: String((e && e.message) || e) }); }

// components/badges/Pill.jsx
try { (() => {
function Pill({
  variant = 'navy',
  children,
  style
}) {
  const bg = variant === 'blue' ? '#0063B0' : '#181C4D';
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-cuerpo)',
      fontWeight: 800,
      fontSize: 12.5,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#fff',
      background: bg,
      padding: '6px 14px',
      borderRadius: 'var(--radio-pill)',
      display: 'inline-block',
      lineHeight: 1.4,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/badges/Pill.jsx", error: String((e && e.message) || e) }); }

// components/buttons/Button.jsx
try { (() => {
function Button({
  variant = 'primary',
  disabled = false,
  href,
  onClick,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const [focus, setFocus] = React.useState(false);
  const V = {
    primary: {
      bg: '#0F75BC',
      bgH: '#0063B0',
      bgA: '#002F5A',
      fg: '#fff',
      fgH: '#fff'
    },
    secondary: {
      bg: 'transparent',
      bgH: '#DBE8F2',
      bgA: '#DBE8F2',
      fg: '#0F75BC',
      fgH: '#0F75BC',
      border: '2px solid #0F75BC'
    },
    cta: {
      bg: '#F78F3F',
      bgH: '#F08921',
      bgA: '#D97714',
      fg: '#181C4D',
      fgH: '#181C4D',
      weight: 800
    },
    white: {
      bg: '#fff',
      bgH: '#EFEEF3',
      bgA: '#DBE8F2',
      fg: '#181C4D',
      fgH: '#181C4D'
    },
    ghost: {
      bg: 'transparent',
      bgH: 'rgba(255,255,255,.08)',
      bgA: 'rgba(255,255,255,.14)',
      fg: '#fff',
      fgH: '#fff',
      border: '2px solid rgba(255,255,255,.55)',
      borderH: '2px solid #fff'
    }
  }[variant === 'link' ? 'primary' : variant];
  if (variant === 'link') {
    const s = {
      fontFamily: 'var(--font-cuerpo)',
      fontWeight: 700,
      fontSize: 16,
      color: hover ? '#0F75BC' : '#0063B0',
      textDecoration: 'none',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      ...style
    };
    const T = href ? 'a' : 'button';
    return React.createElement(T, {
      href,
      onClick,
      style: s,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false)
    }, children, ' →');
  }
  const s = {
    fontFamily: 'var(--font-cuerpo)',
    fontWeight: V.weight || 700,
    fontSize: 16,
    lineHeight: 1.2,
    minHeight: 44,
    padding: '10px 22px',
    borderRadius: 'var(--radio-boton)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    border: hover && V.borderH || V.border || 'none',
    background: disabled ? '#EFEEF3' : active ? V.bgA : hover ? V.bgH : V.bg,
    color: disabled ? '#8A93B0' : hover ? V.fgH : V.fg,
    cursor: disabled ? 'default' : 'pointer',
    textDecoration: 'none',
    transition: 'background .15s, color .15s, border-color .15s',
    boxShadow: focus && !disabled ? 'var(--anillo-foco)' : 'none',
    outline: 'none',
    ...style
  };
  const T = href && !disabled ? 'a' : 'button';
  return React.createElement(T, {
    href,
    onClick: disabled ? undefined : onClick,
    disabled: T === 'button' ? disabled : undefined,
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false)
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/CaseStudyCard.jsx
try { (() => {
function CaseStudyCard({
  image,
  title,
  tag = 'TAB Case Study',
  href = '#',
  linkLabel,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#fff',
      border: '1.5px solid #DBE8F2',
      borderRadius: 'var(--radio-tarjeta)',
      boxShadow: 'var(--sombra-reposo)',
      overflow: 'hidden',
      fontFamily: 'var(--font-cuerpo)',
      maxWidth: 360,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 170,
      background: '#0F75BC'
    }
  }, image && /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      filter: 'grayscale(1)',
      mixBlendMode: 'multiply'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 14,
      left: 14,
      fontWeight: 800,
      fontSize: 12,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      color: '#fff',
      background: '#181C4D',
      padding: '6px 14px',
      borderRadius: 'var(--radio-pill)'
    }
  }, tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 19,
      lineHeight: 1.3,
      color: '#181C4D',
      marginBottom: 10
    }
  }, title), /*#__PURE__*/React.createElement("a", {
    href: href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: hover ? '#0F75BC' : '#0063B0',
      textDecoration: 'none'
    }
  }, linkLabel || 'Leer la historia', " ", '→')));
}
Object.assign(__ds_scope, { CaseStudyCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CaseStudyCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.jsx
try { (() => {
function TestimonialCard({
  variant = 'light',
  quote,
  name,
  company,
  initials,
  style
}) {
  const navy = variant === 'navy';
  const ini = initials || (name || '').split(' ').map(w => w[0]).slice(0, 2).join('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: navy ? '#0A153C' : '#fff',
      border: navy ? 'none' : '1.5px solid #DBE8F2',
      borderRadius: 'var(--radio-tarjeta)',
      boxShadow: 'var(--sombra-reposo)',
      padding: '26px 28px',
      fontFamily: 'var(--font-cuerpo)',
      maxWidth: 420,
      ...style
    }
  }, navy && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 54,
      height: 54,
      background: '#F78F3F',
      clipPath: 'polygon(100% 0, 0 0, 100% 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 44,
      lineHeight: .6,
      color: '#F78F3F'
    }
  }, '“'), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-editorial)',
      fontStyle: 'italic',
      fontSize: 17,
      lineHeight: 1.65,
      color: navy ? '#fff' : '#181C4D',
      margin: '10px 0 16px'
    }
  }, quote), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 2.5,
      background: navy ? '#F78F3F' : '#1A60AD',
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: '#0F75BC',
      border: navy ? '2px solid #F78F3F' : 'none',
      color: '#fff',
      fontWeight: 700,
      fontSize: 15,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, ini), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700,
      fontSize: 15,
      color: navy ? '#fff' : '#181C4D'
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 13,
      color: navy ? '#9DD4E8' : '#4A5578'
    }
  }, company))));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-cuerpo)',
      fontSize: 15,
      color: disabled ? '#8A93B0' : '#181C4D',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'default' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      accentColor: '#0F75BC',
      width: 18,
      height: 18,
      margin: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  helper,
  error,
  disabled = false,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  const uid = React.useMemo(() => id || 'in-' + Math.random().toString(36).slice(2, 7), [id]);
  const border = error ? '1.5px solid #B4530A' : focus ? '1.5px solid #0F75BC' : '1.5px solid #B9C4D8';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-cuerpo)',
      display: 'grid',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: uid,
    style: {
      fontWeight: 700,
      fontSize: 13.5,
      color: '#181C4D'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    id: uid,
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      fontFamily: 'var(--font-cuerpo)',
      fontSize: 15,
      color: error ? '#B4530A' : '#181C4D',
      padding: '11px 14px',
      borderRadius: 'var(--radio-input)',
      border,
      outline: 'none',
      background: disabled ? '#EFEEF3' : error ? '#FFF7F0' : '#fff',
      boxShadow: focus && !error ? 'var(--anillo-foco-input)' : 'none',
      transition: 'border-color .15s, box-shadow .15s'
    }
  }), (error || helper) && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      lineHeight: 1.4,
      color: error ? '#B4530A' : '#4A5578'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  label,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      fontFamily: 'var(--font-cuerpo)',
      fontSize: 15,
      color: disabled ? '#8A93B0' : '#181C4D',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'default' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    defaultChecked: defaultChecked,
    onChange: onChange,
    disabled: disabled,
    style: {
      accentColor: '#0F75BC',
      width: 18,
      height: 18,
      margin: 0
    }
  }), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/motifs/ProcessDiagram.jsx
try { (() => {
const DEFAULT_STEPS = [{
  name: 'Align',
  detail: 'Behavior & Communication'
}, {
  name: 'Vision',
  detail: 'Vision, Values & Culture'
}, {
  name: 'Diagnose',
  detail: 'Diagnostics, SWOT & CSFs'
}, {
  name: 'Plan',
  detail: 'Goals, Actions, Strategies & KPIs'
}, {
  name: 'Execute',
  detail: 'Priorities, Accountability & Communication'
}, {
  name: 'Optimize',
  detail: 'Continuous Review & Revision'
}];
function ProcessDiagram({
  steps = DEFAULT_STEPS,
  size = 380,
  children,
  style
}) {
  const n = steps.length,
    seg = 360 / n;
  const segColors = ['var(--seg-1)', 'var(--seg-2)', 'var(--seg-3)', 'var(--seg-4)', 'var(--seg-5)', 'var(--seg-6)'];
  const conic = steps.map((_, i) => segColors[i % 6] + ' ' + i * seg + 'deg ' + (i + 1) * seg + 'deg').join(', ');
  const rLabel = size / 2 - 16,
    rDot = size / 2 - 2,
    rDetail = size * 0.30,
    rCenter = size * 0.19;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      fontFamily: 'var(--font-cuerpo)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      background: 'conic-gradient(from -30deg, ' + conic + ')'
    }
  }), steps.map((s, i) => {
    const a = -30 + seg / 2 + i * seg;
    return /*#__PURE__*/React.createElement("div", {
      key: 'l' + i,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%,-50%) rotate(' + a + 'deg) translateY(' + -rLabel + 'px)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: size * 0.037,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: '#fff',
        whiteSpace: 'nowrap'
      }
    }, s.name);
  }), steps.map((s, i) => {
    const a = -30 + seg / 2 + i * seg;
    return s.detail ? /*#__PURE__*/React.createElement("div", {
      key: 'd' + i,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: size * 0.30,
        marginLeft: size * -0.15,
        transform: 'rotate(' + a + 'deg) translateY(' + -rDetail + 'px) rotate(' + -a + 'deg)',
        textAlign: 'center',
        fontSize: size * 0.032,
        lineHeight: 1.35,
        color: '#fff'
      }
    }, s.detail) : null;
  }), steps.map((_, i) => {
    const a = -30 + i * seg,
      d = size * 0.075;
    return /*#__PURE__*/React.createElement("div", {
      key: 'n' + i,
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: d,
        height: d,
        marginLeft: -d / 2,
        marginTop: -d / 2,
        transform: 'rotate(' + a + 'deg) translateY(' + (-rDot + d / 2) + 'px) rotate(' + -a + 'deg)',
        borderRadius: '50%',
        background: '#F78F3F',
        border: '2.5px solid #fff',
        color: '#fff',
        fontWeight: 800,
        fontSize: d * 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, i + 1);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: rCenter * 2,
      height: rCenter * 2,
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      background: '#fff',
      border: size * 0.014 + 'px solid #F08921',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }
  }, children));
}
Object.assign(__ds_scope, { ProcessDiagram });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motifs/ProcessDiagram.jsx", error: String((e && e.message) || e) }); }

// components/motifs/SCurveDivider.jsx
try { (() => {
function SCurveDivider({
  fill = '#0A153C',
  stroke = true,
  strokeWidth = 5,
  height = 110,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1440 110",
    preserveAspectRatio: "none",
    style: {
      display: 'block',
      width: '100%',
      height,
      ...style
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0,86 C420,132 900,-14 1440,52 L1440,110 L0,110 Z",
    fill: fill
  }), stroke && /*#__PURE__*/React.createElement("path", {
    d: "M0,86 C420,132 900,-14 1440,52",
    fill: "none",
    stroke: "#1A60AD",
    strokeWidth: strokeWidth
  }));
}
Object.assign(__ds_scope, { SCurveDivider });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/motifs/SCurveDivider.jsx", error: String((e && e.message) || e) }); }

// ui_kits/social/CaseStudyPost.jsx
try { (() => {
function CaseStudyPost() {
  const {
    Pill
  } = window.TABDesignSystem_018620 || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1350,
      height: 700,
      background: '#EFEEF3',
      overflow: 'hidden',
      fontFamily: 'var(--font-cuerpo)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: '46%',
      height: '100%',
      background: '#DBE8F2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4A5578',
      fontWeight: 600,
      fontSize: 17
    }
  }, "Foto real: retrato del miembro"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 52,
      top: 46
    }
  }, /*#__PURE__*/React.createElement(Pill, {
    style: {
      fontSize: 20,
      padding: '10px 22px'
    }
  }, "Case study")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 54,
      top: 122,
      fontWeight: 800,
      fontSize: 24,
      letterSpacing: '.03em',
      textTransform: 'uppercase',
      color: '#0063B0'
    }
  }, "Mike Mayo\xA0\xA0|\xA0\xA0Nanohmics"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      top: 190,
      background: 'rgba(255,255,255,.8)',
      padding: '30px 40px 34px 54px',
      fontFamily: 'var(--font-display)',
      color: '#181C4D'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 60,
      lineHeight: 1.12
    }
  }, "LEADING SMARTER"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 54,
      lineHeight: 1.16,
      opacity: .92
    }
  }, "BY LEARNING TO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 800,
      fontSize: 68,
      lineHeight: 1.1
    }
  }, "DELEGATE")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 54,
      bottom: 44
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo/tab-logo-color.png",
    style: {
      width: 230,
      display: 'block'
    },
    alt: "TAB - The Alternative Board"
  })));
}
window.CaseStudyPost = CaseStudyPost;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/CaseStudyPost.jsx", error: String((e && e.message) || e) }); }

// ui_kits/social/StratProPost.jsx
try { (() => {
function StratProPost() {
  const {
    ProcessDiagram
  } = window.TABDesignSystem_018620 || {};
  const ph = label => /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: '#DBE8F2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4A5578',
      fontWeight: 600,
      fontSize: 15,
      textAlign: 'center',
      padding: 12
    }
  }, label);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 1080,
      height: 1080,
      background: '#0A153C',
      overflow: 'hidden',
      fontFamily: 'var(--font-cuerpo)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 62,
      top: 96,
      bottom: 64,
      width: 12,
      background: '#F08921'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 62,
      top: 96,
      width: 420,
      height: 12,
      background: '#F08921'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 540,
      top: 20,
      width: 470,
      height: 470,
      background: '#002F5A',
      transform: 'rotate(45deg)',
      transformOrigin: 'center'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 470,
      top: 130,
      width: 610,
      textAlign: 'center',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 58,
      letterSpacing: '.02em'
    }
  }, "STRAT", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F78F3F'
    }
  }, "PRO")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 17,
      letterSpacing: '.3em',
      marginTop: 18
    }
  }, "BROUGHT TO YOU BY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 54,
      marginTop: 14
    }
  }, "TAB"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14,
      letterSpacing: '.28em',
      marginTop: 6
    }
  }, "THE ALTERNATIVE BOARD")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 64,
      top: 78,
      width: 380,
      fontFamily: 'var(--font-editorial)',
      fontWeight: 400,
      fontSize: 44,
      lineHeight: 1.4,
      color: '#fff'
    }
  }, "Strategy matters, but alignment is what turns strategy into movement."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 14,
      bottom: 56
    }
  }, /*#__PURE__*/React.createElement(ProcessDiagram, {
    size: 520
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontFamily: 'var(--font-display)',
      fontWeight: 800,
      fontSize: 26,
      color: '#181C4D',
      lineHeight: 1.05
    }
  }, "STRAT", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#F08921'
    }
  }, "PRO")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 96,
      top: 470,
      width: 300,
      height: 200,
      overflow: 'hidden'
    }
  }, ph('Foto real: manos + engranes')), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 116,
      bottom: 88,
      width: 380,
      height: 300,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,.2)'
    }
  }, ph('Foto real: junta de equipo')));
}
window.StratProPost = StratProPost;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/StratProPost.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.CaseStudyCard = __ds_scope.CaseStudyCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.ProcessDiagram = __ds_scope.ProcessDiagram;

__ds_ns.SCurveDivider = __ds_scope.SCurveDivider;

})();
