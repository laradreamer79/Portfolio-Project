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
- `npm test` — run the automated test suite once
- `npm run test:watch` — rerun tests while files change
- `npm run typecheck` — check TypeScript without generating files
- `npm run typecheck:tests` — type-check source code and tests

## Tests

The automated tests cover validation, authentication and role authorization,
and booking cancellation permissions. Prisma is mocked in service tests, so
running the suite does not read or modify the local or production database.

```bash
npm test
```

## Structure

```text
src/
├── admin/        Admin feature
├── auth/         Authentication feature
├── bookings/     Booking feature
├── centers/      Diving-center feature
├── courses/      Course feature
├── instructors/  Instructor feature
├── middleware/   Express middleware
├── payments/     Payment feature
├── reviews/      Review feature
├── trips/        Trip feature
├── app.ts        Express application setup
└── server.ts     Server entry point
```
