---
name: tab-publicacion
description: Create a TAB (The Alternative Board) publication from a marketing strategy. Takes the target audience from the wiki, asks a short set of questions about the publication (Instagram carousel or LinkedIn post, topic, objective and CTA, data), reads the TAB information in the vault, produces four different options of the piece in the TAB brand in Spanish (Mexico), lets the user choose one, runs a change-review loop, optionally animates the piece (HTML to MP4) if the user wants, writes the accompanying text, runs a second review loop and then publishes (LinkedIn and Instagram, both via the Buffer connector). Use when Luisart says "haz una publicación de TAB", "post para TAB", "carrusel de TAB", "contenido para Taste of TAB / StratPro / Hi-MAP", or gives a TAB strategy and wants the piece made. Not for @soyluisart posts and not for TAB videos (those use the TAB video brand and luisart-* skills).
---

# tab-publicacion

Audience from the wiki first, a few questions second, four options third, then choice, review, optional animation, caption, review and publishing. The output is a publication that serves one clear strategic goal and only says what TAB's own material backs up.

Talk to Luisart in Spanish. The publication itself is in **Spanish (Mexico)**, MXN for money, unless he says otherwise. This file and the wiki notes are in English.

## Paths are placeholders (the wiki moves between devices)

Nothing below is a fixed path. `<VAULT>` is the vault root on the device in use, `<TAB>` is the TAB sources folder inside it, and `<TAB-DESIGNS>` is the folder of ready-made TAB design resources, and `<TAB-WIKI>` is the folder with the TAB wiki pages. All four are found and re-validated in step 0 and can change from one computer to another.

Current known locations (relative to `<VAULT>`; these are the starting guess, step 0 corrects them): `<TAB>` = `Finanzas/TAB`, `<TAB-DESIGNS>` = `wiki/Content Creation/Designs/TAB`, `<TAB-WIKI>` = `wiki/Content Creation/Styles/TAB`. Never hard-code `C:\Users\...` in anything you write.

## What this skill reads (all read-only)

| Need | Where (relative to `<VAULT>`) |
|---|---|
| Strategy options, audiences, funnel stages, formats, do/don't, tone | `wiki/Content Creation/Styles/TAB/TAB Marketing Brief.md` (read it every time) |
| Brand: colours, type, motifs, logo rules, language decisions | `wiki/Content Creation/Styles/TAB/TAB Video Brand.md`, `TAB Gallery.md`; project files `TubeAI/channels/tab/`, assets `TubeAI/media/tab/brand/` |
| Entity, concepts, glossary, sample board, peer-board model | `wiki/Knowledge/Entities/TAB.md`, `wiki/Knowledge/Concepts/**` (search for TAB, StratPro, Hi-MAP, Sample Board, Peer Advisory Board Model, Accountability Ecosystem, False Beliefs Table), `wiki/Knowledge/Summaries/TAB/` |
| Ready-made TAB design resources (generated from the TAB design system: templates, charts, cards, sheets) | `<TAB-DESIGNS>` (see "TAB design resources" below) |
| Original sources (only to verify a claim, a number or a quote) | `<TAB>` (subfolders `fuentes/marketing`, `fuentes/best-practices`, `fuentes/Hi-Map`, `fuentes/sales`, `operaciones/`, `overview.md`) |

If a relative path above does not exist in this vault, search for it by file name (step 0) instead of failing.

Never open `Notas personales/`. Never edit anything in the source folders (a new deliverable is the only thing written there, see "Filing").

## Flow

### 0. Locate and re-validate the paths (every time the skill is launched, before any question about the piece)

The wiki moves between devices and folders get renamed, so nothing is trusted from memory: **every run re-validates every path**, even when `ruta.local.json` exists.

1. **Vault folder. Ask for it unless it is already cited.** It counts as cited when any of these is true, in this order:
   - the user's message names a folder or path;
   - the file `ruta.local.json` next to this SKILL.md exists and its `vault` still exists on disk;
   - the current working directory (or a parent) is a vault: it holds `CLAUDE.md` and a `wiki/` folder.

   If none holds, ask once, in Spanish: "Antes de empezar, cita la carpeta de tu wiki (la raíz del vault). Puedes pegar la ruta o arrastrar la carpeta aquí." Do nothing else until he answers. Check that the path exists and looks like the vault (`wiki/` and `CLAUDE.md`); if not, say what is missing and ask again.
2. **Re-validate the TAB paths.** For each one, test the saved or known path first; if it is missing or does not look right, search under `<VAULT>` (skip `node_modules`, `.git`, `.venv`, `Notas personales`):

   | Path | How it is recognised |
   |---|---|
   | `<TAB>` (sources) | directory named `TAB` that contains `fuentes/` or `overview.md` (usual `Finanzas/TAB`) |
   | `<TAB-DESIGNS>` (design resources) | directory named `TAB` with `TAB-*.png` / `tab-*.png` files, usually `wiki/Content Creation/Designs/TAB` |
   | `<TAB-WIKI>` (TAB wiki pages) | the folder holding `TAB Marketing Brief.md`, `TAB Video Brand.md` and `TAB Gallery.md` (usual `wiki/Content Creation/Styles/TAB`) |

   - One match: use it. Several: list them and ask which. None: say which one was not found and ask for the path. Without `<TAB>` the piece is built from the wiki pages with every figure marked unconfirmed; without `<TAB-DESIGNS>` the visuals are built from scratch in the TAB brand and he is told.
3. **If any path changed, update everything that records it** (this is the rule to keep the skill alive after a move):
   - rewrite `ruta.local.json` next to this file: `{"vault": "...", "tab": "...", "designs": "...", "wiki_tab": "...", "fonts": "...", "found": "<YYYY-MM-DD>"}` (per device, not committed, listed in `.gitignore`);
   - edit the "Current known locations" line near the top of this SKILL.md to the new relative paths, and update the other copy of the skill if both exist (`TubeAI/.claude/skills/tab-publicacion/` in the vault and `~/.claude/skills/tab-publicacion/`);
   - update the paths written in the wiki page `Designs/TAB Resources` (see "TAB design resources") and add a `Log.md` entry (`[content] updated`, old path -> new path).
4. Run the font check of "TAB fonts" below. Then say in one line what was found ("Vault: …, TAB: …, Recursos: …, Fuentes: ok / descargadas") and, if something changed, what was updated. Then continue to step 1. Do not ask for the folder again while the saved one is valid.

## TAB fonts (download once, keep them with the TAB resources)

The TAB brand uses three typefaces: **Montserrat** (700 and 800, display), **Open Sans** (400, 600, 700, body) and **IBM Plex Sans italic** (400, 500, quotes). Every render needs them as **local files**, and they must not be fetched again on every run.

The permanent home is `<TAB-DESIGNS>/fonts/` (inside the TAB resources folder, so it travels with the wiki). Files are `.woff2` (and `.ttf` if available) named `<family>-<weight>-<style>.<ext>`, plus a small `FONTS.json` manifest (`family`, weight, style, file, source URL, licence, date downloaded). The three families are open source (SIL Open Font License), so keeping a copy is allowed.

**Every launch, in step 0, after the paths are validated:**
1. Check `<TAB-DESIGNS>/fonts/` against the list above (every family, weight and style present, files not empty). If everything is there: **use them, do not download anything and do not ask the user**.
2. If something is missing, check whether it is installed on the system (Windows `C:\Windows\Fonts` and `%LOCALAPPDATA%\Microsoft\Windows\Fonts`, macOS `/Library/Fonts` and `~/Library/Fonts`, Linux `~/.fonts` and `/usr/share/fonts`). If installed, copy the files into `<TAB-DESIGNS>/fonts/` (do not leave them only in the system folder).
3. If still missing, **download only the missing ones** from a legitimate open-font source into `<TAB-DESIGNS>/fonts/`: Google Fonts or the Fontsource packages (for example `https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-800-normal.woff2`, same pattern for `open-sans` and `ibm-plex-sans` with `-italic`). Always take the **`latin` and `latin-ext`** subsets so that accents, `ñ`, `¿`, `¡`, `®` and `·` render. Verify each download (HTTP 200, size above a few KB, opens as a font; try the next source if not), update `FONTS.json`, and tell the user in one line what was downloaded and where. This is the only download the skill does by itself, and it is authorised here; anything else that must be downloaded needs his yes.
4. Use the files from that folder everywhere: in the HTML as `@font-face { src: url("<relative path to fonts/>...") }` (copy the folder next to the working HTML if the renderer needs a relative path), never a remote `<link>` or `@import`. Before rendering, make sure the fonts are loaded (`document.fonts.ready`) and look at the output: text must not fall back to a default font.
5. If a download is impossible (offline, blocked), say so once, name the missing files, and ask him to drop them into `<TAB-DESIGNS>/fonts/`; do not render with fallback fonts and do not keep asking on later steps.
6. Record the fonts folder in `ruta.local.json` (`"fonts"`) and keep it inside the path re-validation of step 0: if `<TAB-DESIGNS>` moves, the fonts move with it.

## TAB design resources

`<TAB-DESIGNS>` holds the pieces already generated from the TAB design system, as PNG files named `TAB-<element>-<variant>-v.png` (vertical) plus overview sheets (`tab-hoja-casos`, `tab-hoja-graficas`, `tab-hoja-proceso`) and `tab-poster`. At the time of writing it contains, among others: headline (light / navy), case-study diagonal, quote card (testimonial), before/after StratPro, StratPro process wheel, stats trio, metric percentage, bar / line / donut charts, progress bars, checklist, comparison in two columns, arrow flow / callout, pipeline stages, roadmap first year, Feel-Felt-Found objection, pay-grade, host-pitch benefits, invitation countdown, tool teaser (Heat Map), board table session, lower-third person, message card, section title and CTA end card.

How to use them:
- **List the folder on every run** (do not rely on the list above) and read the overview sheets to see what exists.
- **Reuse before inventing:** for each slide or image, pick the resource whose type fits the idea (hook = headline, proof = case study / quote / metric, process = wheel or flow, contrast = before-after or comparison, closing = CTA end). Use it as the visual base or as the exact layout/style reference, keeping its colours, type, motifs and logo treatment, and rebuild it with the new Spanish text at **1080×1350**. The resources are stills of vertical video clips at **1080×1920 (9:16)**, so they are a *layout and style reference*, never the final file: re-compose the same elements for 4:5 (same grammar, colours, type, motifs, logo treatment), do not stretch, crop or letterbox the 1080×1920 image.
- Never edit or overwrite a file in `<TAB-DESIGNS>`; the rebuilt slides go to the scratchpad and then to the piece's own folder.
- If no resource fits, design the slide in the TAB brand (step 5) and say so; propose adding it to the folder.
- Name the resources used for each slide in the wiki page of the piece (`## Sources Used`).

### Category -> reference example

Each publication category has a reference example in `<TAB-DESIGNS>` (file `TAB-<element>-<variant>-v.png`, or the overview sheets) and a catalogue entry in `<TAB-WIKI>/TAB Gallery.md` ("Element catalogue") that lists the layout, its props and the rules of that element. When the user gives (or answers) a category, **look it up here, open the reference image and its catalogue entry, and adapt it to the new topic** at 1080×1350. If the category is not in the table, pick the closest row, say which one you used, and offer to add the new category to this table.

| Category (what the user may say) | Reference example in `<TAB-DESIGNS>` | Adapt it like this |
|---|---|---|
| Caso de éxito / historia de un socio | `TAB-case-study-diagonal-v.png` (also `claro` on `tab-hoja-casos`) | Dark chip "CASO DE ÉXITO", real name \| company, two-weight headline with the emphasis word in azul-tab, portrait/photo area, logo. Real photo only if approved |
| Testimonio / cita de socio o autor | `TAB-quote-card-testimonio-v.png` (`cita` for a famous author) | Quote in IBM Plex Sans italic, accent on one word, hooked arrow to name, title and company |
| Resultado / cifra de un socio, dato clave | `TAB-metric-porcentaje-v.png` (`tiempo` variant on the sheet) | One big number computed from before/after, caption, before-after bars, "dato de ejemplo" unless confirmed |
| Varias estadísticas / reporte | `TAB-stats-trio-gerentes-v.png` | Three stat cards with proportion bars, source line each, optional four-path tiles |
| Gráfica (comparar, crecer, repartir) | `TAB-bar-chart-barras-v.png`, `TAB-line-chart-crecimiento-v.png`, `TAB-donut-reparto-v.png`, `TAB-progress-bars-metas-v.png` | Pick by data shape: compare = bars, trend = line, share of a whole = donut, goals = progress bars; one rising arrow, labelled source |
| Antes y después / contraste | `TAB-before-after-stratpro-v.png`, `TAB-comparison-dos-columnas-v.png` | Two halves or two columns, 4 items each, circled arrows; keep orange within its 6 % rule (use the `hielo` variant) |
| Proceso, metodología, pasos | `TAB-process-wheel-stratpro-v.png` (6 steps), `TAB-arrow-flow-tres-pasos-v.png` (3-4 steps), `TAB-board-table-sesion-v.png` (cómo funciona un consejo) | Numbered orange markers, one step per slide in a carousel, one rising arrow to the result |
| Checklist / tips accionables | `TAB-checklist-cinco-puntos-v.png` | 3-6 items with drawn marks, last item emphasised |
| Educativo: concepto explicado | `TAB-headline-light-v.png` / `TAB-headline-navy-v.png` for the hook and `TAB-section-title-capitulo-v.png` for chapter slides, plus the process/checklist/comparison rows for the body | One idea per slide, define terms, one everyday example, closing takeaway |
| Mensaje del facilitador / frase de valor | `TAB-message-card-facilitador-v.png`, `TAB-headline-navy-v.png` | One big card, sentences one by one, role signature, rising arrow |
| Objeción / "no tengo tiempo, es caro" | `TAB-feel-felt-found-objecion-v.png` | Objection card + three beats (entiendo cómo te sientes / otros se sintieron igual / esto encontraron) + member result placeholder |
| Valor de tu tiempo / delegar | `TAB-pay-grade-tu-hora-v.png` (`tu-hora-mxn` for MXN) | Two bars (tu hora vs el servicio), computed multiple, lesson line; one currency, "cifras de ejemplo" |
| Invitación a evento / Taste of TAB | `TAB-invitation-cuenta-regresiva-v.png` (`taste` on the sheet) | Eyebrow "Solo por invitación", benefit headline, date/place/"cupo limitado", one orange CTA |
| Herramienta gratuita (Heat Map, What-If) | `TAB-tool-teaser-heat-map-v.png` (`what-if` on the sheet) | Tool name in two weights, 3-4 benefit pills, one CTA |
| Anfitriones / alianzas | `TAB-host-pitch-beneficios-v.png` | Four benefit cards + partner quote with real name or placeholder |
| Ruta del miembro / embudo | `TAB-pipeline-etapas-v.png` | Stages as a rising staircase, current stage highlighted, no percentages |
| Primer año / hoja de ruta | `TAB-roadmap-primer-ano-v.png` | Milestones on one rising S-curve, source line |
| Persona presentada / orador | `TAB-lower-third-persona-marino-v.png` | Name \| company bar; only for a person line on a slide, not a standalone category |
| Anotar algo en una captura o foto | `TAB-arrow-callout-nota-v.png` | Label + arrow + ring on the target |
| Portada, gancho, apertura | `TAB-headline-light-v.png`, `TAB-headline-navy-v.png` | Eyebrow + rule + benefit headline word-level emphasis + S-curve |
| Cierre / llamada a la acción | `TAB-cta-end-cierre-v.png` (`cierre-marino` on navy, no logo) | Logo on light only, headline, one orange CTA with navy text, contact placeholder |

Carousel recipe: slide 1 = hook (headline reference), slides 2..n-1 = the body in the references of the chosen category (one element per slide, mix at most 2-3 element families so the series stays coherent), last slide = CTA end (or a closing takeaway for educational pieces). A single-image LinkedIn post uses one reference of the category. Always keep the same palette variant (light or navy) across the whole carousel, alternating only where the references already do.

When a reference carries sample text ("Texto de ejemplo", "[fecha]", "Dato de ejemplo"), replace it with the confirmed content or keep the label if the figure is not confirmed; never leave a placeholder in a published piece.

### 1. Target audience (taken from the wiki, never asked)

The audience is not a question. Read it from the wiki every time and state it in one line before the questions:
- `wiki/Knowledge/Entities/TAB.md` and `<TAB>/overview.md`: segment (owners and general managers of growing private businesses, revenue above 5M MXN, 3+ employees, operating territory), core need (stop deciding alone, grow with peer accountability), tone.
- `TAB Marketing Brief.md` section 1: audiences table. Public-facing posts default to **business owners and leadership teams**; hosts, referral partners and new facilitators are a smaller stream and only if the user's answer points there.
- Use the wiki wording (and its dated figures only under the statistics rule of step 2). If the wiki and the sources disagree, say so.

### 2. Gather the TAB information that serves that strategy

Read only what the topic and objective need: the Brief, the matching concept pages, the summaries, and, for any figure or quote you plan to print, the original file in `<TAB>`. Build a short fact sheet: each fact with its source path. Rules:
- A fact without a source in the vault is not used. Say what is missing instead of inventing it.
- **Statistics:** the sources disagree (23,000 vs 15,000 businesses; sample board 2 h vs 60-90 min; 2.5x growth, 25 %, 92 %, 4+ years only in the vault entity page). Use a figure only if Luisart confirms it in this request; otherwise leave it out or mark the piece "dato de ejemplo".
- Case studies and testimonials: real name + title + company, never anonymous, never invented. If none is provided, build the piece around the idea, not a fake testimonial.
- Famous quotes: check the exact words and attribution against a vault source; if you cannot, do not use the quote.
- Confidentiality of boards: never show or imply real board discussions.

### 3. Ask the questions about the publication

The only publication types are an **Instagram carousel** and a **LinkedIn post**. Ask the questions below in one message (use AskUserQuestion with the options when available, otherwise a numbered list in Spanish). Do not ask anything else, and skip a question the user already answered:

1. **Type:** carrusel de Instagram, publicación de LinkedIn, or both (the carousel text adapted into a LinkedIn post).
2. **Category and topic:** which category of publication (see "Category -> reference example": caso de éxito, testimonio, dato o gráfica, antes y después, proceso, checklist, educativo, objeción, valor del tiempo, invitación, herramienta, etc.) and what is it about? Offer options drawn from the wiki (Taste of TAB, StratPro, Hi-MAP, Leadership Heat Map / What-If Calculator, a case study, a peer-board idea such as "dejar de decidir solo") plus "otro".
3. **Objective and CTA:** what should the reader do? Options: contenido educacional, registrarse a un evento, agendar una llamada, descargar una herramienta, solo awareness. One only.
   - **Contenido educacional:** the piece teaches one idea the owner can apply this week, and sells nothing. Take the idea from the wiki (`wiki/Knowledge/Concepts/**`, the TAB glossary, Peer Advisory Board Model, Accountability Ecosystem, StratPro steps, management and leadership concepts) and explain it from zero: define each term in one sentence, give one everyday business example in MXN (marked "dato de ejemplo" if invented), end with one takeaway or a reflection question. The CTA is soft or absent (guardar, compartir, comentar); no event or sales push, and TAB appears only as the logo and a closing line. If the user gives no topic, offer three concepts from the wiki to choose from.
4. **Data to include:** any real figure, name, quote, date or event details he wants on it; if none, say that none will be used.

If the user already names a category, do not ask it again: go to its reference example. Decide the rest yourself from the wiki and state it in one line after the answers: message pillar and funnel stage (Brief sections 2 and 3), headline, slide count, tone. Do not ask about language (Spanish, Mexico), format size, colours or hashtags.

**Required formats (both networks use 4:5).** Every image of every piece is **1080×1350 px, ratio 4:5, PNG, static**. Do not use 1350×705, 1080×1080 or any other size, whatever the older TAB posts in the Brief used. Keep all text and logos inside a safe margin of at least 5 % (about 55 px) on every side.

| Network / type | Required format | Text |
|---|---|---|
| Instagram carousel | 5-9 slides, each 1080×1350 (4:5), one idea per slide (hook, problem, 3-5 development slides, CTA slide), uploaded in order | Spanish caption of 90-220 words, max 5 hashtags |
| LinkedIn post | text plus one image 1080×1350 (4:5) when the topic benefits from it; a multi-image LinkedIn post uses the same size for every image | Spanish text of 90-290 words (boardroom tone, hook in the first two lines, short paragraphs, one soft CTA, 3-5 hashtags) |

Before publishing, verify the pixel size and ratio of every file; re-render any that is not 1080×1350.

### 4. Write the copy

#### Brand voice (TAB)

Source: `<TAB>/overview.md` ("Tono y comunicación"), `TAB Marketing Brief.md` section 2 (tone and voice), `TAB Video Brand.md` (personality and copy). Re-read them each run; if they change, they win over this summary.

**Who speaks:** a peer-to-peer mentor, a fellow business owner who has been there. Never a vendor pitching and never a lecturer. Professional, optimistic, direct; rising and clear.

| Trait | In practice |
|---|---|
| Cercana y accesible | Talks to the owner as an equal, "tú", TAB as "nosotros". Members are "dueños de negocio", never "clientes" in community pieces. |
| Práctica y directa | No empty theory ("soluciones prácticas, no teorías"). Every piece answers "¿qué hago con esto?". Short declarative sentences, plain business Spanish. |
| Empática, problema primero | Opens on a felt problem (decidir solo, repetir la misma conversación, cansancio de liderazgo), then the fix, then a soft CTA. |
| Respaldada por pruebas | Real stories and confirmed data, never claims in the air. Case studies with real name and company. |
| Da valor primero | "Give to get": teach or help before inviting. |
| Sobria y optimista | Confident, warm, never hype: no emojis, no chains of exclamation marks, no clickbait, no guarantees. |

**Say it like this / not like this**
- Benefit in the headline, sentence case: "Deja de cargar solo con toda la decisión" – not "¡Somos los mejores consejos del mercado!".
- Lead with the reader ("¿qué gano yo?"), not with the company or its titles.
- Contrast pairs and before/after are welcome ("sin consejo / con consejo").
- Avoid "servicio" and "calidad" as claims, buzzwords and anglicisms when a plain word exists (keep brand names: TAB, StratPro®, Hi-MAP, Taste of TAB).
- Phrases the brand already uses (adapt to Spanish, do not copy the English): "Shared Wisdom, Bottom Line Success", "trabaja en tu negocio, no dentro de él", "la estrategia importa, pero la alineación la convierte en movimiento".

**Channel adjustment** (Brief: LinkedIn is a boardroom, executive networking space): the LinkedIn post is more professional and reflective; the Instagram carousel is a bit lighter and more visual, shorter lines, same voice, same rules.

**Educational pieces** use the same voice: a mentor explaining over coffee, not a textbook.

#### Rules

- Peer-to-peer mentor voice (see above): "tú" to the owner (use "usted" only if Luisart says so), TAB speaks as "nosotros". Plain business Spanish, short declaratives, benefit-led, problem first then the fix, contrast pairs allowed.
- One dominant headline of **6-8 words** (hard max 12), at most one supporting line, one CTA. No paragraphs on images.
- Brand names stay as they are: TAB, StratPro®, Hi-MAP, Taste of TAB, "Brought to you by TAB". First on-screen use of a registered mark carries ®.
- No emojis, no chains of exclamation marks. Avoid "servicio" and "calidad" as claims. Do not guarantee results. Do not lead with the company.
- Caption: 90-290 words by type (Brief section 4), opens on the felt problem, ends on the soft CTA, max 5 hashtags (#TABboards plus topical).
- Investing or financial content: do not give personalised advice.

### 5. Design the visual: always four different options

Never deliver a single design. Produce **four different options of the same publication** (same topic, objective, audience, facts and copy intent) so the user can choose the one he likes most. The options must be really different from each other, not four colour swaps. Vary at least two of these axes between options:
- **Reference example / layout:** a different element of the category (for instance case-study diagonal vs quote card vs metric for the same success story), or a different arrangement of the same element.
- **Hook angle:** a different headline and first line (problem, benefit, number, question).
- **Palette:** light/pearl versus navy canvas (respecting the colour ratio of the brand).
- **Visual weight:** text-led, data/graphic-led, or photo/portrait-led.

Rules:
- Carousel: each option is a **complete carousel** (all slides, same slide count unless the option's structure needs one more or one fewer). Label them Opción A, B, C, D. Within one option keep one palette and one family of references.
- LinkedIn post: each option is a different image (and a different opening line for the text); the full text is written only for the chosen one in step 8.
- All four respect the same facts and the same rules (format, voice, no invented data); only the design and the angle change.
- Name the reference resource used for each option for each slide.
- Parallel work is welcome: build the four options in parallel (one sub-agent per option) when the pieces are carousels, then run the same checks on all four.

- Start from the ready-made resources in `<TAB-DESIGNS>` (see "TAB design resources"). Use the TAB look from `TAB Video Brand.md`: navy / azul-tab / white-pearl ratio, orange at most about 6 % and never as small text on white, Montserrat (display), Open Sans (body), IBM Plex Sans italic (quotes), **one** ascending S-curve per piece, logo only on white or pearl, never recoloured. **No mascots, no Pizarra look, no pixel characters.**
- Reuse the real-post grammar (Brief section 5): case study = chip + name/company + headline + portrait + logo; quote card = quote + CAPS attribution + logo; tool promo = two-weight title + 3-4 short benefit lines + one CTA pill; StratPro = navy canvas + six-segment wheel or before/after columns.
- Build or adapt it as HTML and render it to PNG with Playwright at the exact size (fonts as local files from `<TAB-DESIGNS>/fonts/`, never remote). Keep working files and scripts in the scratchpad.
- Real photos: none exist yet. Use the neutral panel with a photo slot and say so; never use a flat illustration as the only image.
- Design pass: apply the vault design rule in order (channel brand first, then `taste-skill` for direction, then `/impeccable critique` and `audit`), and open the PNGs to look at them before delivering (text fit, contrast, safe margin of at least 5 % on every side).

### 6. Check the four options before showing them

- [ ] Matches the audience of step 1 and the one objective and CTA of step 3
- [ ] Every fact, figure, name and quote traces to a source path; unconfirmed numbers removed or marked
- [ ] Sounds like the TAB voice (peer mentor, practical, problem first, no hype); no emojis, no guarantees, no invented testimonial, no confidential board content
- [ ] Spanish (Mexico) with accents and ñ rendering; brand names untouched
- [ ] TAB colours/type/logo rules respected, readable at phone size
- [ ] Flag in the report: anything carrying the TAB logo needs **written approval from TAB Marketing** before it is published (the Brand Policy and Logo Use Guide are not in the vault)

### 7. Show the four options in the chat, collect feedback, reach conclusions

1. **Put the four options in the chat itself**, not only as paths: send one contact sheet per option (all slides of a carousel side by side, or the single image of a LinkedIn post) with the file-sending tool (`SendUserFile`, `display: render`), in order A, B, C, D, and open the images yourself too. Add a caption of one line per option saying what makes it different (reference used, hook angle, palette). Also give the file paths.
2. **Ask for feedback**, open and short, in Spanish: "¿Qué opinas de cada una? Dime cuál te gusta más y qué te gusta o no de cada opción (diseño, gancho, colores, cantidad de texto)." He may choose one, mix elements ("el diseño de la B con el gancho de la C"), or reject all.
3. **Reach your own conclusions.** Do not just pick the option he names. Read his feedback and write a short conclusion in the chat, in Spanish, before touching anything:
   - the option or combination that wins and why;
   - what he liked (keep) and what he disliked (drop) across all four options, including the options he did not choose;
   - what that says about his preferences for this brand (density of text, palette, type of hook, level of data), noting which of these is a one-time taste for this piece and which looks like a lasting preference;
   - anything in his feedback that conflicts with the TAB rules (for example a claim without a source or orange in small text): say so and propose the closest compliant version.
   Then ask him to confirm the conclusion in one line ("¿Voy con esto?"). Only after his confirmation build the chosen version; if he corrects the conclusion, update it and confirm again.
4. If none convinces him, use the conclusions to produce four new options that apply what was learned, and repeat from step 1. Only the confirmed direction goes forward; the other options stay in the scratchpad until the piece is filed.

### 7b. Review the chosen version (loop)

Show the chosen publication in full in the chat (send the PNGs, list the paths) and ask, in Spanish: "¿Quieres hacer cambios a la publicación?"
- **Yes:** let the user say what to change, apply exactly those changes, re-run the checks of step 6 on what changed, show the result and ask again. Repeat until the answer is no.
- **No:** continue to step 8.
Keep each version in the scratchpad; do not file anything yet.

### 7c. Animate the publication (optional, only if he wants it)

When the chosen version is final (7b answered "no changes"), ask in Spanish: "¿Quieres animar la publicación?" **Only if he says yes, animate it. If he says no, skip this step and go to step 8 (caption). Never animate without his yes.** Also ask in the same message which versions he wants to publish at the end (only the static images, only the animation, or both), so step 10 knows.

If yes:
1. **HTML first.** Rebuild every slide (or the single image) as an HTML page at **1080×1350** with the same final design: same copy, colours, type, logo and layout, local fonts only from `<TAB-DESIGNS>/fonts/` (never remote). Every animated element runs on a **paused, seekable timeline** (GSAP or the Web Animations API) so each frame can be rendered deterministically. Use the HyperFrames flow of the vault (`hyperframes` skills, `TubeAI/videos/` for the project) or the lighter one: one HTML per slide, the timeline stepped frame by frame with Playwright at 30 fps, then FFmpeg.
2. **TAB motion rules** (from `TAB Video Brand.md`; read them again every time): brief and smooth, ease-out only; elements fade in with a 16 px rise in about 12 frames; headline words appear every 3 frames; the one S-curve or rising arrow draws on in about 26 frames; numbers count up; no bounces, springs, glassmorphism or decorative gradients; no whooshes. Each slide holds its final composition long enough to read. Do not change the copy, the facts or the layout while animating: the animation shows what he approved.
3. **Render to MP4** with the heavy-job rules of the vault: from `<VAULT>/TubeAI/`, one heavy job at a time, long renders as background tasks (no polling). Output: **MP4 H.264, yuv420p, 1080×1350 (4:5), 30 fps, AAC audio track present**, 5-8 s per slide for a carousel (one MP4 per slide, in order, same slide numbering), 6-10 s for a single post. Sound: none by default; soft UI sounds (`click`, `tap`, `pop`, `ding`) at volume 0.25 or less only if he asks. **Music: never chosen by the assistant for TAB unless he asks for it**; if he does, calm licensed instrumental, clearly under any voice (none here), and say which track.
4. **Check before showing:** pixel size and ratio of every MP4, duration, first frame readable (not blank), last frame equal to the approved still, text inside the safe margin during the whole motion, no element jumping or overlapping, Spanish accents rendering. Fix and re-render what fails.
5. **Show it in the chat:** send the MP4s (`SendUserFile`, `display: render`) plus the paths, and ask: "¿Quieres cambios a la animación?" Loop like 7b (apply exactly what he asks, re-render only what changed, show again) until he says no.
6. Heavy files: MP4s stay local (they are git-ignored) and, once filed, get a copy in Google Drive `My Drive/lartyk/videos/<same relative path>` as the vault rules say. The HTML sources go to the scratchpad (or `TubeAI/channels/tab/` if he wants them kept); only the final MP4s go to the piece's folder, in a `Videos/` subfolder next to the PNGs.

Then continue to step 8.

### 8. Caption / accompanying text

Ask: "¿Pasamos a generar el texto que acompaña la publicación?" If yes, write it from the context of the approved piece: its topic, objective, CTA, audience and the brand voice of step 4, using only facts from the fact sheet.
- **Instagram caption:** 90-220 words, first line is the hook (it shows before "más"), short lines, one soft CTA, max 5 hashtags (#TABboards plus topical).
- **LinkedIn post text:** 90-290 words, hook in the first two lines, short paragraphs, boardroom tone, one soft CTA, 3-5 hashtags. If the piece is an image, the text complements it and does not repeat it.
- Educational pieces: end with the takeaway or a reflection question, not a sales push.
- Present the text in full in the chat.

### 9. Review the text (loop)

Ask: "¿Quieres hacer alguna corrección al texto?"
- **Yes:** take his feedback, apply it, show the new text and ask again until he says no.
- **No:** continue to step 10.

### 9b. Final summary to the user

When the animation (7c) and the text (steps 8-9) are both approved, give the user a closing summary **in the chat, before asking to publish**. If the piece was animated, the final MP4 is the headline of the summary; if he declined the animation, the same summary is given with the final PNGs instead.
- **The final file(s):** send the final MP4(s) again with `SendUserFile` (`display: render`), in slide order for a carousel, and list their full paths. Add the PNGs only if he chose to publish both versions.
- **The accompanying text, in full and ready to copy:** the approved caption (Instagram) and/or post text (LinkedIn), each under its own label, exactly as it will be published.
- **A short summary, in Spanish, of the piece:** audience, category and the reference example used, objective and CTA, chosen option (A-D) and the main decision behind it, format (1080×1350, 4:5), number of slides and duration of each MP4, and what is still open (unconfirmed figures, placeholder photos, the TAB logo approval flag).
- **What will be published and where:** channel(s), static or animated or both, and the proposed date/time (Mexico City), so the next question is concrete.
Then go to step 10 and ask "¿Lo publicamos?".

### 10. Publishing (only after an explicit go-ahead)

Ask: "¿Lo publicamos?" and confirm in one message: channel(s), now or scheduled (date and time, Mexico City), and that the piece and text shown are final. The user's yes at this point is the approval for this run; it does not carry over to other pieces. Without a yes, stop here and leave the piece filed (step 11).

The connectors are deferred tools: load their schemas with ToolSearch before calling them (`buffer` / `create_post`).

- **Both channels -> Buffer connector** (LinkedIn and Instagram; Zernio is not used).
  1. `get_account`, then `list_channels` for the selected organization. Choose the TAB channel of each network (LinkedIn, Instagram). If a network has more than one channel, never guess: list them and ask. Tell him which organization and channels are used.
  2. **LinkedIn post:** `create_post` on the LinkedIn channel with the final text and, if the piece has an image (1080×1350, 4:5), that image attached, or the 1080×1350 MP4 if he chose the animation. Check the text length against LinkedIn's limit before sending.
  3. **Instagram carousel:** create a post of type Post with the slides as **static images, in order** (1080×1350, 4:5), caption in Spanish, max 5 hashtags. If he chose to publish the animation: attach the MP4 slides **one file at a time, in order**, and re-select Post after the first upload; a mix of images and videos in one carousel is allowed only if he asks. Verify the order with `list_posts`.
  4. Follow `wiki/Content Creation/Buffer Publishing Workflow.md` for uploading images and its known pitfalls.
  5. Schedule at the time he chose, or at the time Buffer recommends if he did not choose; "publish now" only if he asked for it. If he chose both channels, create one post per channel.
  6. Afterwards run `list_posts` and verify, for each post, the `dueAt` time, the status, the text and the **order of the images**; fix a wrong time with `edit_post`.
- Never type or store passwords or API keys. If a connector asks to authorize or the session expired, tell him and let him do it.
- Music cannot be added through Buffer; none is needed for static images.
- If a call fails, report the exact error and what was not published. Never retry blindly or create duplicate posts; delete only a post this skill itself created by mistake, and say so.
- Report in Spanish what was published or scheduled: channel, date and time, and post identifiers or links the connector returns.

### 11. Filing and report

The piece is TAB company material, so it is filed in the database, by category, one folder per piece: `<TAB>/publicaciones/<YYYY-MM-DD> <short title>/` holding only the final PNGs (`NN Title.png`). Also write one page in English at `wiki/Content Creation/Styles/TAB/Publications/<title>.md` with: audience, topic, objective, pillar and stage, the Spanish copy and caption, images embedded by full vault path, the final caption/text, where and when it was published (or "not published"), `## Sources Used` (every page or file read), open points and the approval flag, ending in `## Key Takeaways`; link it from `TAB Gallery.md` and add a `Log.md` entry (`[content] ingest`, wrote bullets). File the approved version after step 9 even if he decides not to publish. Work locally: no commit or push unless Luisart asks.

Report to Luisart in Spanish: the audience, objective and CTA used, what was made, the exact paths, what was published or scheduled, what is unconfirmed or needs his decision (figures, photos, TAB approval), and nothing about internals.

## Never

- Publish, schedule or delete anything on LinkedIn or Instagram without the explicit yes of step 10, and never to a channel he did not confirm.
- Deliver a single design instead of four options, skip showing them in the chat, or build the chosen version before he confirms your conclusions in step 7
- Animate without his explicit yes in step 7c, or publish a version he did not choose (static or animated)
- Skip the two review loops (steps 7b and 9) or move on while the user still has changes pending.
- Invent statistics, clients, quotes or results.
- Mix the @soyluisart look (dotted board, Pizarra, pixel mascots) into TAB pieces.
- Use TAB marks as a noun or plural, or recolour/rebuild the logo or sub-brand marks.
