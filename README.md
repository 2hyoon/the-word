# the Word

A web app that randomly draws a Bible verse for you to hold onto today.

## Features

- 120 Bible verses floating as particles across the screen
- Tap or click a particle to reveal the verse card
- Save the verse as a 1080×1080 image for sharing
- Korean / English language toggle
- Particle colors grouped by biblical section (OT Wisdom / OT Prophets / Gospels / Epistles & Revelation)

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **html2canvas** — image export
- **Lora** (Google Fonts) + **NanumSquareNeo** (local font)

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
npm run start
```

## Deploy

Connected to [Vercel](https://vercel.com) — pushing to `main` triggers automatic deployment.

## Architecture

See [docs/ADR.md](docs/ADR.md) for architecture decision records covering the tech stack choices, font setup, image export pipeline, and color system.

## Development Methodology

Built using a harness engineering approach: each feature was broken into explicitly scoped steps with shell-verifiable acceptance criteria, enabling structured AI-assisted development with predictable, reviewable output. Step definitions live in `phases/`.
