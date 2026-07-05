# Oyster Backend

Express REST API written in TypeScript.

## Requirements

- Node.js
- npm

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The API runs at `http://localhost:3000` by default.

Check it with:

```text
GET /api/health
```

## Scripts

- `npm run dev` — start the development server with automatic reload
- `npm run build` — compile TypeScript into `dist`
- `npm start` — run the compiled server
- `npm run typecheck` — check TypeScript without generating files

## Structure

```text
src/
├── config/       Environment configuration
├── controllers/  Request handlers
├── middleware/   Express middleware
├── routes/       API route definitions
├── services/     Business logic
├── app.ts        Express application setup
└── server.ts     Server entry point
```

Prisma, authentication, and feature APIs are intentionally handled in
separate tasks.
