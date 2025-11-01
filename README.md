# Budżet Domowy MVP

Aplikacja webowa do zarządzania budżetem domowym z naciskiem na automatyczne generowanie listy wydatków na kolejny miesiąc.

## Tech Stack

- [Astro](https://astro.build/) v5.7 - Framework do budowy szybkich aplikacji SSR/SSG
- [Twig JS](https://github.com/twigjs/twig.js) v1.17 - Silnik szablonów renderowany w Node.js
- [TypeScript](https://www.typescriptlang.org/) v5 - Statyczne typowanie kodu
- [Tailwind CSS](https://tailwindcss.com/) v4.0.17 - Utility-first CSS framework

## Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/przeprogramowani/10x-astro-starter.git
cd 10x-astro-starter
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Project Structure

```md
.
├── src/
│   ├── layouts/    # Layouty Astro
│   ├── pages/      # Strony Astro i endpointy API
│   │   └── api/    # Punkty końcowe API
│   ├── components/ # Komponenty Astro
│   ├── views/      # Szablony Twig
│   └── assets/     # Statyczne zasoby
├── public/         # Publiczne zasoby
```

## AI Development Support

Projekt zawiera zestaw reguł AI w katalogu `.cursor/rules/`, które opisują strukturę katalogów, najlepsze praktyki kodowania, integrację Astro z Tailwind CSS oraz podstawy pracy z Twigiem.

## Contributing

Please follow the AI guidelines and coding practices defined in the AI configuration files when contributing to this project.

## License

MIT
