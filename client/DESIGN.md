# DESIGN BRIEF: "The Doom Dossier"

Dark classified-file / briefing-room feel. NOT a SaaS dashboard.

## Colors
Define as CSS variables in globals.css and Tailwind v4 @theme tokens:
- ink #0A0F0D (page bg)
- ink-2 #101814 (surface)
- ink-3 #17221C (raised)
- paper #EAE3D0 (main text)
- paper-dim #9A9783 (muted text)
- brass #C9A24B (accent)
- brass-bright #E8C877
- verdigris #4FB598 (watched/success)
- ember #E4572E (remaining time/errors)
- Hairline border: brass at 18% opacity (`rgba(201, 162, 75, 0.18)`)

## Fonts via next/font/google
- Fraunces: display headings and big numbers, use optical size / soft style
- Instrument Sans: body text
- JetBrains Mono: labels, numbers, runtimes. Labels are small, uppercase, wide letter-spacing, mono.

## Shape & Aesthetic
- Sharp corners (2-4px radius max).
- Thin 1px brass hairlines, corner tick marks on important panels, large numerals.
- Subtle film-grain overlay (SVG feTurbulence noise, ~5% opacity, fixed, pointer-events none).
- A soft brass radial glow behind page headings and a faint green fog gradient in a corner.

## Chapter Structure
Each page is a "chapter":
- 01 The Archive (Movies)
- 02 The Rewatch Path (Plan)
- 03 Opening Night (Booking)
With a big mono chapter number and a Fraunces title.

## Motion (motion/react)
- Staggered list entrances
- Shared-layout underline on the active nav item (layoutId)
- Animated count-up numbers
- Spring-based drawer
- Hover spotlight on cards that follows the mouse
- Subtle page fade/slide transitions
- Everything must respect prefers-reduced-motion.

## Prohibitions (DO NOT)
- DO NOT use purple/blue/pink gradients
- DO NOT use glassmorphism
- DO NOT use Inter or Geist fonts
- DO NOT use big rounded-2xl cards
- DO NOT use centered-everything hero layouts
- DO NOT use emoji icons
- DO NOT use default shadcn-looking components
- Use asymmetric layouts, strong typographic hierarchy and generous spacing.
- Do not use any Marvel logos, posters or copyrighted artwork; text only.
- Add a tiny footer line: "Fan-made project. Not affiliated with Marvel."

## Accessibility
- Visible brass focus rings
- Keyboard-friendly
- aria-live for results
- Good contrast
- Fully responsive down to 360px.

