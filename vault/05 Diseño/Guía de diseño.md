---
tags: [diseño]
estado: propuesta
actualizado: 2026-10-18
---
# Guía de diseño

## Dirección
Cálido, confiable y limpio. Mucho espacio en blanco, fotos de mascotas como protagonistas, verde de marca para acciones.

## Paleta (tokens CSS)
| Token | Valor | Uso |
|---|---|---|
| `--color-primario` | `#2f9e6e` | Botones, enlaces (evoluciona el `#5cb85c` actual con mejor contraste) |
| `--color-primario-oscuro` | `#237a55` | Hover |
| `--color-acento` | `#f59e42` | Destacados, "nuevo", corazones |
| `--color-fondo` | `#fbfaf7` | Fondo general (crema suave) |
| `--color-superficie` | `#ffffff` | Cards, modales |
| `--color-texto` | `#1f2937` | Texto principal |
| `--color-texto-suave` | `#6b7280` | Texto secundario |
| `--color-borde` | `#e5e7eb` | Bordes |
| `--color-error` | `#dc2626` | Errores de formulario |

## Tipografía
- Títulos: **Nunito** (redondeada, amigable). Texto: **Inter**. Ambas de Google Fonts.
- Escala: 14 · 16 · 20 · 24 · 32 · 48 px.

## Componentes base
Botón (primario / secundario / peligro), Input con label y error, Card de mascota (foto 4:3, chips de especie/edad/género, estado), Modal centrado y responsive, Navbar con menú hamburguesa, Badge de estado, Toast/alerta.

## Reglas
- **Mobile-first**; breakpoints 640 / 1024 px.
- Nada de selectores globales de elementos fuera de `styles/base.css` (fue la causa de bugs, ver [[Problemas detectados#CSS / diseño]]).
- Contraste AA mínimo; texto sobre imagen siempre con overlay.
- Radios 12px, sombras suaves, transiciones de 150–200 ms.
