# Sprint 2 Test Results

Sprint 2 focused on database setup, authentication, registration, login, logout, protected routes, and role behavior.

## Summary

| Area | Status | Evidence |
| --- | --- | --- |
| Database migrations | Pass | Prisma migration command notes |
| Seed users | Pass | Seeded account login tests |
| Register/login/logout | Pass | Browser and Postman notes |
| Role protection | Pass | Protected route/API checks |

## Test Results

| Test name | Preconditions | Steps | Expected result | Actual result | Status | Evidence | Related issue/PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Register diver | Backend/frontend running | Register with diver/user role | User account created | Registration completed | Pass | Browser form note | N/A |
| Register instructor | Backend/frontend running | Register with instructor role and license number | User and instructor profile created | Registration completed | Pass | Browser form and DB note | N/A |
| Register diving center | Backend/frontend running | Register with center details | User and diving center created | Registration completed | Pass | Browser form and DB note | N/A |
| Login valid user | Seed users exist | `POST /api/auth/login` with valid credentials | `200 OK` and token returned | Token returned | Pass | Postman login request | N/A |
| Login invalid user | Backend running | Login with wrong password | `401 Unauthorized` | `401` returned | Pass | Postman login request | N/A |
| Token storage | Login succeeds in browser | Refresh page after login | Session remains active | Session persisted | Pass | Browser local storage note | N/A |
| Logout | Authenticated user | Click logout | Token removed and user logged out | Logout completed | Pass | Browser manual check | N/A |
| Role-based redirect | Seed users exist | Login as each role and open dashboard | Correct dashboard opens | Role dashboards opened | Pass | Browser route notes | N/A |
| Admin-only API | Admin and non-admin tokens available | Call admin route with each token | Admin gets access, non-admin blocked | `200` for admin, `403` for non-admin | Pass | Postman admin route requests | N/A |

## Notes

- Public registration excludes admin account creation.
- Admin accounts are created through seed data or database setup only.
