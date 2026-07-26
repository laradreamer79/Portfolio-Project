# Sprint 3 Retrospective

## What Went Well

- Catalog pages were connected to real backend data.
- Booking, review, and dashboard flows became functional end to end.
- Feature-based folders made frontend and backend flows easier to trace.

## What Did Not Go Well

- Some pages initially contained service and state-management logic.
- Concurrent feature branches caused merge conflicts.
- Inconsistent validation required additional cleanup.

## Lessons Learned

- Smaller pull requests reduce conflicts and simplify reviews.
- Business rules must be enforced by backend services, not only the UI.
- Keeping validation close to each feature improves maintainability.

## Improvement Actions

| Action | Owner | Due Sprint | Status |
|---|---|---|---|
| Extract page logic into feature hooks and services | Frontend team | Sprint 4 | Completed |
| Standardize backend feature structure | Backend team | Sprint 4 | Completed |
| Expand validation and authorization tests | Team | Sprint 4 | Completed |
