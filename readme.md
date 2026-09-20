# TAB Design System — The Alternative Board

Sistema de diseño de **TAB (The Alternative Board)**, franquicia internacional de consejos asesores (peer advisory boards) y coaching para dueños de negocio. Incluye la sub-marca **StratPro®** (programa de alineación estratégica de equipos, naranja+azul, siempre "Brought to you by TAB") y el evento **Taste of TAB** (sesión de muestra por invitación). Versión 1.0 · Agosto 2026.

**Personalidad:** profesional, optimista, directa. Ascenso y claridad (la flecha del icono), nunca corporativa fría ni juguetona. La era previa sepia/script queda excluida.

## Fuentes de este sistema
- \`uploads/TAB - Design System.md.txt\` — guía de identidad v1.0, verificada píxel a píxel contra el material vigente. **Ground truth de todos los valores.**
- Carpeta local \`marketing/\` (solo lectura) — colateral real: logo 2 tintas, imágenes StratPro 1–4, cabecera Eventbrite Taste of TAB, posts de LinkedIn junio 2026, brochures, guiones y cartas de eventos. Sin código de producto ni Figma.

## FUNDAMENTOS DE CONTENIDO
- **Idioma del material fuente:** inglés (mercado EE. UU.); esta guía documenta en español. Escribe piezas en el idioma del público.
- **Tono:** mentor entre pares — directo, alentador, sin jerga vacía. Habla de resultados de negocio ("turns strategy into movement", "Leading smarter by learning to delegate").
- **Persona:** "you/tu negocio" al lector; TAB habla como "we". Los miembros son "business owners", nunca "clientes" en piezas de comunidad.
- **Titulares:** frases de beneficio en sentence case; palabras clave en MAYÚSCULAS solo como acento display ("INVITATION ONLY", "DELEGATE").
- **Eyebrows/badges:** MAYÚSCULAS con tracking amplio ("CASE STUDY", "BROUGHT TO YOU BY").
- **Casos:** nombre real + empresa ("Mike Mayo | Nanohmics") — credibilidad ante todo.
- **Emojis: no forman parte de la marca.** Sin signos de exclamación en cadena; optimismo por contenido, no por puntuación.

## FUNDAMENTOS VISUALES
- **Color:** blanco/Perla 52% · marinos 22% · Azul TAB 12% · Azul Acción 8% · naranja ≤6%. Máx. 1–2 fondos de color por pieza. Naranja jamás como texto pequeño sobre blanco (2.3:1); sobre marino rinde 7.6:1. \`#1A60AD\` solo trazos, nunca relleno.
- **Tipo:** Montserrat 600–800 display (sustituta libre de Gotham), Open Sans cuerpo/UI/H2-H3, IBM Plex Sans itálica para citas y voz editorial. **Nunca Poppins, nunca script/serif.**
- **Fondos:** blanco o Perla como lienzo claro; Marino Fondo \`#0A153C\` como lienzo oscuro (StratPro). Sin gradientes decorativos salvo el velo fotográfico.
- **Fotografía:** siempre real — mesas de junta, diversidad visible; nunca ilustración plana como única imagen. Tratamientos: velo marino (gradiente 90°) con texto blanco a la izquierda, o duotono azul (\`multiply\` \`#0F75BC\`).
- **Motivos:** curva "S" ascendente (una por pieza, filete 4–6px \`#1A60AD\`); cortes diagonales + diamante 45° \`#002F5A\` sobre marino con triángulos naranja; pills y filetes cortos 48×2.5px; diagrama circular de proceso de 6 segmentos con puntos naranja en las fronteras.
- **Espaciado:** escala 4px (4·8·16·24·32·48·72·96). Retícula 12 col, gutter 24, contenedor 1180px. Social 1080 con margen de seguridad 72px.
- **Radios:** 6 inputs · 10 botones · 14 tarjetas · pill badges. **Bordes tarjeta:** 1.5px \`#DBE8F2\`.
- **Sombras:** reposo \`0 2px 8px rgba(24,28,77,.10)\` · elevada \`0 10px 28px rgba(24,28,77,.16)\`. Sin sombras internas.
- **Interacción:** hover = color más profundo (azul→\`#0063B0\`, naranja→\`#F08921\`); presionado aún más profundo (\`#002F5A\`/\`#D97714\`); foco = anillo azul translúcido. Sin bounces; transiciones breves de color/opacidad.
- **Transparencia/blur:** solo el velo fotográfico y bordes fantasma \`rgba(255,255,255,.55)\` sobre marino; sin glassmorphism.
- **Enlaces:** \`#0063B0\`, hover \`#0F75BC\`, terciario con flecha "→".

## ICONOGRAFÍA
- **No hay set de iconos propio** en el material: la identidad se apoya en el icono TAB (cuadro con curva-flecha), el mark StratPro (flecha en cuadro partido naranja/azul) y motivos geométricos. No inventar iconos de marca.
- Números en círculos naranja como marcadores de proceso; flecha "→" unicode en enlaces terciarios.
- Si una pieza necesita iconos utilitarios, usar [Lucide](https://unpkg.com/lucide@latest) trazo 2px en \`--azul-tab\` o blanco — **sustitución flagged**, no aparece en el material fuente.
- Sin emoji, sin icon fonts.

## Activos (assets/)
- \`assets/logo/tab-logo-color.png\` — logo principal 2 tintas (fondos blancos/Perla). **Único archivo de logo provisto.** Las variantes blanca/marina/icono aisladas que la guía referencia no venían en el material: aparecen solo dentro de las piezas. No se reconstruyeron — usar el PNG provisto o texto plano.
- \`assets/imagery/stratpro-1..4.png\` — piezas StratPro junio 2026 (lienzo marino, diamante, diagrama).
- \`assets/imagery/taste-of-tab-header.png\` (2160×1080) y \`taste-of-tab-linkedin.png\` — evento sobre Perla con curva "S".
- \`assets/imagery/li-pulse-june-2026.png\`, \`assets/imagery/social/*.png\` — posts reales de referencia (case study, duotono).

## Índice
- \`styles.css\` → \`tokens/\` (fonts, colors, typography, spacing, base) — solo @imports.
- \`guidelines/\` — tarjetas specimen de fundamentos (color, tipo, espaciado, motivos).
- \`components/buttons/\` Button · \`components/forms/\` Input, Checkbox, Radio · \`components/badges/\` Pill, Chip · \`components/motifs/\` SCurveDivider, ProcessDiagram · \`components/cards/\` TestimonialCard, CaseStudyCard — cada uno con .d.ts, .prompt.md y tarjeta @dsCard.
- \`ui_kits/social/\` — recreación de piezas sociales reales (StratPro 1080, case study).
- \`SKILL.md\` — punto de entrada para agentes.

## Adiciones intencionales
- Ninguna familia fuera de la guía. Lucide como fallback utilitario documentado arriba.

## Pendientes / sustituciones
- **Fuentes vía Google Fonts CDN** (la guía las especifica como Google Fonts; Gotham original no provista — Montserrat es la sustituta oficial de la guía). No hay binarios locales.
- Variantes de logo (blanca, marino, icono, wordmark) y logos StratPro/Hi-MAP no provistos como archivos.
