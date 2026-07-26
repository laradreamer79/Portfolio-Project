# Sprint 3 Planning

## Sprint Details

- Status: Completed
- Sprint goal: Replace mock data with real APIs and complete catalog, booking, review, and dashboard features.

## Planned Scope

- Complete the remaining Prisma models and relationships.
- Implement Diving Center, Trip, and Course APIs.
- Connect catalog and detail pages to real APIs.
- Implement search and filters.
- Implement booking creation, cancellation, and availability.
- Prevent overbooking.
- Implement review APIs and frontend integration.
- Connect User and Diving Center dashboards.

## Proposed Ownership

| Area | Owner | Suggested branch |
|---|---|---|
| Frontend API integration | Frontend Integration Owner | `feature/frontend-catalog-api` |
| Catalog APIs | Backend Feature Owner | `feature/catalog-api` |
| Booking APIs | Backend Feature Owner | `feature/booking-api` |
| Database model changes | Database Owner | `feature/core-database-models` |
| Review and acceptance testing | Project Manager | `test/sprint-03-acceptance` |

## Definition of Done

- Core APIs are documented and tested.
- Frontend mock data is replaced for in-scope features.
- Booking availability is enforced by the backend.
- Dashboards display real data.
- Relevant automated and Postman tests pass.
