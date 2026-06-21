# Spell It

A modern, interactive spelling app based on the Soundwaves program. Built for classroom differentiation with simpler (6A) and difficult (6B) levels.

## Features

- **Home screen** with live date/time, random encouraging messages, and mascot
- **Black / purple / white theme** with light mode toggle
- **Segmenting activity** — break words into phonemes and graphemes (core Soundwaves skill)
- **Two difficulty levels** — simpler (6A) and difficult (6B) for differentiation
- **Post-segmenting activities** — word build, spell check, suffix match, handwriting focus
- **Teacher dashboard** — add/edit sounds, suffixes, and word lists (saved to localStorage)
- **Learning process screens** — intentions, success criteria, and routine from the program

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router

## Assets

Mascot images and the Spell It logo are in `/public`. They have transparent backgrounds ready for use.

## Teacher Data

All teacher-added content (sounds, suffixes, word lists) persists in the browser via localStorage.
