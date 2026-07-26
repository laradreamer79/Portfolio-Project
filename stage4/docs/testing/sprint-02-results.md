# Sprint 2 Test Results

## Database and Prisma

| Test | Expected | Actual | Status |
|---|---|---|---|
| Prisma schema validation | Schema is valid | Schema validated | Pass |
| Prisma Client generation | Client generates | Client generated | Pass |
| Migration | PostgreSQL schema is created | Migration completed | Pass |
| Repeatable seed | Two runs succeed without duplicates | Seed completed without duplicate records | Pass |
| Backend build and start | Server starts successfully | Server started successfully | Pass |

## Authentication

| Test | Expected | Actual | Status |
|---|---|---|---|
| Register valid user | Returns success and user data | User registered | Pass |
| Duplicate email | Returns `409` | Request rejected with `409` | Pass |
| Login valid credentials | Returns JWT and user | JWT and user returned | Pass |
| Login invalid credentials | Returns `401` | Request rejected with `401` | Pass |
| Protected endpoint without token | Returns `401` | Request rejected with `401` | Pass |
| Wrong role | Returns `403` | Request rejected with `403` | Pass |
| Frontend role redirect | Opens correct dashboard | Correct dashboard opened | Pass |
| Logout | Clears authentication | Authentication cleared | Pass |
