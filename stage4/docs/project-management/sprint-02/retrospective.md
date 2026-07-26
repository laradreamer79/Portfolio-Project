# Sprint 2 Retrospective

## What Went Well

- Prisma and PostgreSQL were integrated successfully.
- JWT authentication and role-based redirects worked across the application.
- The frontend and backend authentication flows were connected.

## What Did Not Go Well

- Frontend and backend work required additional coordination around response formats.
- Role-specific registration fields increased validation complexity.

## What We Learned

- Shared API contracts reduce integration errors.
- Validation must be enforced by both the frontend and backend.
- Authentication and authorization should remain separate concerns.

## Improvement Actions

| Action | Owner | Due Sprint | Status |
|---|---|---|---|
| Document shared API contracts | Team | Sprint 3 | Completed |
| Add backend validation and authorization tests | Backend team | Sprint 3 | Completed |
| Connect protected frontend routes to role checks | Frontend team | Sprint 3 | Completed |
