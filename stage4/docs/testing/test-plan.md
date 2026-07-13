# Stage 4 Test Plan

## Objectives

- Verify Must Have user flows.
- Prevent regressions when feature branches are merged.
- Validate authentication and role authorization.
- Confirm frontend, backend, database, and payment integration.

## Test Levels

| Level | Tool | Owner | Purpose |
|---|---|---|---|
| Static checks | TypeScript, lint | Feature owner | Catch type and code-quality problems |
| Frontend component tests | Vitest, React Testing Library | Frontend owner | Test user-facing component behavior |
| Backend API tests | Vitest, Supertest | Backend owner | Test Express endpoints and errors |
| Manual API tests | Postman | Backend owners and reviewer | Verify contracts and collect evidence |
| End-to-end tests | Playwright | Project Manager / QA | Verify complete browser flows |
| Acceptance testing | Browser and production environment | Team | Confirm sprint and release criteria |

## Critical Test Flows

1. Register, Login, Refresh, and Logout.
2. Role-based redirects and protected routes.
3. Browse centers, trips, and courses.
4. Create and cancel a booking.
5. Prevent overbooking.
6. Complete or reject a payment.
7. View User and Diving Center dashboard data.
8. Perform authorized Admin operations.

## Pull Request Quality Gate

- [ ] Acceptance criteria are satisfied.
- [ ] Typecheck passes.
- [ ] Build passes.
- [ ] Lint passes where configured.
- [ ] Relevant automated tests pass.
- [ ] Postman evidence is provided for API changes.
- [ ] No secrets are committed.
- [ ] Documentation is updated.
- [ ] At least one approving review is recorded.
