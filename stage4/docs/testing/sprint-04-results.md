# Sprint 4 Test Results

Sprint 4 focused on final catalog testing coverage, ownership rules, visibility rules, validation behavior, and documentation completeness.

## Summary

| Area | Status | Evidence |
| --- | --- | --- |
| Public catalog visibility | Pass | Postman public GET notes |
| Admin/owner visibility | Pass | Postman authenticated GET notes |
| Instructor independent listings | Pass | Postman create requests |
| Diving center listings | Pass | Postman create requests |
| Ownership checks | Pass | Postman update/delete requests |
| Validation errors | Pass | Postman invalid payload requests |
| Testing documentation | Pass | This documentation set |

## Test Results

| Test name | Preconditions | Steps | Expected result | Actual result | Status | Evidence | Related issue/PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Public `status=all` centers | No token | `GET /api/centers?status=all` | Only approved centers returned | Approved-only list returned | Pass | Evidence: public catalog notes | N/A |
| Public `status=all` trips | No token | `GET /api/trips?status=all` | Only approved trips returned | Approved-only list returned | Pass | Evidence: public catalog notes | N/A |
| Public `status=all` courses | No token | `GET /api/courses?status=all` | Only approved courses returned | Approved-only list returned | Pass | Evidence: public catalog notes | N/A |
| Admin `status=all` | Admin token | GET catalog endpoints with `status=all` | Admin sees approved, pending, rejected | Admin received all statuses | Pass | Evidence: admin visibility notes | N/A |
| Owner `status=all` | Instructor or center token | GET trip/course endpoints with `status=all` | Owner sees own non-approved listings and allowed approved listings | Owner visibility worked | Pass | Evidence: owner visibility notes | N/A |
| Instructor creates independent trip | Instructor token | Create trip without `centerId` | `201`, `instructorId` set, `centerId` null | Trip created as instructor-owned | Pass | Evidence: instructor posting notes | N/A |
| Instructor creates independent course | Instructor token | Create course without `centerId` | `201`, `instructorId` set, `centerId` null | Course created as instructor-owned | Pass | Evidence: instructor posting notes | N/A |
| Diving center creates trip | Center token | Create trip | `201`, `centerId` set, `instructorId` null | Trip created as center-owned | Pass | Evidence: center posting notes | N/A |
| Diving center creates course | Center token | Create course | `201`, `centerId` set, `instructorId` null | Course created as center-owned | Pass | Evidence: center posting notes | N/A |
| Invalid trip payload | Auth token | Missing title, invalid difficulty, invalid date, or invalid price | `400 Validation failed` | Validation errors returned | Pass | Evidence: validation notes | N/A |
| Instructor updates own listing | Instructor token | `PUT /api/trips/:ownId` and course equivalent | Success | Update succeeded | Pass | Evidence: ownership notes | N/A |
| Instructor blocked from center listing | Instructor token | Update/delete center-owned trip/course | `403 Forbidden` | Forbidden returned | Pass | Evidence: ownership notes | N/A |
| Center updates own listing | Center token | `PUT /api/trips/:ownId` and course equivalent | Success | Update succeeded | Pass | Evidence: ownership notes | N/A |
| Center blocked from instructor listing | Center token | Update/delete instructor-owned trip/course | `403 Forbidden` | Forbidden returned | Pass | Evidence: ownership notes | N/A |
| Admin manages any listing | Admin token | Update/delete trip/course | Success | Admin action succeeded | Pass | Evidence: admin notes | N/A |
| Database ownership check | Prisma Studio | Inspect created trip/course rows | Each listing has exactly one owner | Rows matched expected ownership | Pass | Evidence: database confirmation notes | N/A |

## Notes

- Screenshots were not required for this evidence set.
- Evidence is recorded as text observations in [evidence](./evidence/README.md).
