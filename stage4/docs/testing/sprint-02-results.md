# Sprint 2 Test Results

> Update this document as Sprint 2 work is reviewed.

## Database and Prisma

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Prisma schema validation | Schema is valid | [Add result] | [Pass / Fail] | [Add evidence] |
| Prisma Client generation | Client generates | [Add result] | [Pass / Fail] | [Add evidence] |
| Migration | PostgreSQL schema is created | [Add result] | [Pass / Fail] | [Add evidence] |
| Repeatable seed | Two runs succeed without duplicates | [Add result] | [Pass / Fail] | [Add evidence] |
| Backend build and start | Server starts successfully | [Add result] | [Pass / Fail] | [Add evidence] |

## Authentication

| Test | Expected | Actual | Status | Evidence |
|---|---|---|---|---|
| Register valid user | Returns success and user data | [Add result] | [Pass / Fail] | [Add Postman result] |
| Duplicate email | Returns `409` | [Add result] | [Pass / Fail] | [Add evidence] |
| Login valid credentials | Returns JWT and user | [Add result] | [Pass / Fail] | [Add evidence] |
| Login invalid credentials | Returns `401` | [Add result] | [Pass / Fail] | [Add evidence] |
| Protected endpoint without token | Returns `401` | [Add result] | [Pass / Fail] | [Add evidence] |
| Wrong role | Returns `403` | [Add result] | [Pass / Fail] | [Add evidence] |
| Frontend role redirect | Opens correct dashboard | [Add result] | [Pass / Fail] | [Add browser evidence] |
| Logout | Clears authentication | [Add result] | [Pass / Fail] | [Add evidence] |
