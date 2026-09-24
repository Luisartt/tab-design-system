# TAB Brand Kit v1.0

Kit de producción de marca para TAB (The Alternative Board), construido sobre el design system de este repo. La fuente de verdad sigue siendo `uploads/TAB - Design System.md.txt`: si algo aquí contradice la guía, gana la guía.

Abre `index.html` con un servidor local para ver el kit completo:

```bash
npx serve .          # desde la raíz del repo
# http://localhost:3000/brand-kit/
```

## Qué hay

| Carpeta | Contenido |
|---|---|
| `logos/` | Variantes del logo en SVG y PNG (color, blanca, marino, wordmark, icono), favicon y avatares. Vectorizadas del PNG oficial; ver `logos/README.md`. |
| `photos/` | Las 5 fotografías de marca (`01`–`05`), la lista de tomas (`shots.json`) y el shootout de modelos (`SHOOTOUT.md`). |
| `templates/` | Plantillas HTML editables y el estudio (`editor.html`) para editarlas y exportar PNG. |
| `exports/` | PNG de ejemplo de cada plantilla, generados con `tools/render.mjs`. |
| `tools/` | `generate-image.mjs` (fotos on-brand vía fal.ai), `photo-style.json` (estilo de la casa) y `render.mjs` (render por lotes). |

## Fotografía con IA: reglas de uso

La guía pide fotografía real. Estas imágenes son generadas, así que se tratan como banco de imágenes editorial:

- Sí para ambiente: heroes, posts de concepto, banners de eventos, fondos virtuales.
- Nunca en case studies, testimonios o cualquier pieza con el nombre de una persona real. Ahí va la foto real del miembro.
- La IA genera solo la foto. Logo, texto y motivos se agregan en las plantillas, así nunca salen letras deformes ni logos falsos.

## Generar más fotos

```bash
cd brand-kit/tools
export FAL_KEY=...            # nunca la escribas en un archivo del repo
export NODE_USE_ENV_PROXY=1   # solo si tu red usa proxy

# Una toma nueva con el estilo de la casa
node generate-image.mjs --prompt "A business owner reviewing numbers with her CFO..." --aspect 4:5 --models nano-banana-pro

# Regenerar tomas de la lista, comparando modelos
node generate-image.mjs --shots ../photos/shots.json --only 03-owner --models nano-banana-pro,seedream-5-pro
```

Modelos disponibles: `nano-banana-pro` (Google, mejor realismo y ~30 s por imagen), `nano-banana-2` (más barato), `seedream-5-pro` (ByteDance). Las candidatas se guardan en `photos/candidates/` con un `.json` de metadatos (modelo, prompt, dimensiones) para poder reproducirlas.

Higgsfield Soul no está disponible en fal.ai. Si el equipo usa Higgsfield, `photo-style.json` sirve igual como prompt base: pega el `style` y el `avoid` al final de cada prompt.

## Pendientes

- Reemplazar los SVG vectorizados por los maestros de agencia si TAB HQ los entrega.
- Variantes de logo StratPro y Hi-MAP: siguen sin archivo fuente.
- Hospedar `logos/tab-logo-color-600.png` en una URL pública y ponerla en `templates/email-signature.html`.
