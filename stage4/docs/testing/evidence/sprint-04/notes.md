# Sprint 4 Evidence Notes

Evidence in this file is text-based. Screenshots are not required.

## Environment

| Item | Value |
| --- | --- |
| Backend URL | `http://localhost:3000` |
| Frontend URL | `http://localhost:5173` |
| API tool | Postman |
| Database tool | Prisma Studio |

## Evidence Log

### Public Catalog Visibility

Test: Public `status=all` catalog requests  
Steps: Sent GET requests to `/api/centers?status=all`, `/api/trips?status=all`, and `/api/courses?status=all` without a token.  
Expected: Only approved records are returned.  
Actual: Public responses returned approved records only.  
Status: Pass  
Notes: Pending/rejected records were not exposed to public users.

### Admin Visibility

Test: Admin `status=all` catalog requests  
Steps: Sent GET requests with admin token to catalog endpoints using `status=all`.  
Expected: Admin can see approved, pending, and rejected records.  
Actual: Admin received all allowed statuses.  
Status: Pass  
Notes: Admin access is intentionally broader than public access.

### Instructor Independent Listings

Test: Instructor creates trip/course without `centerId`  
Steps: Sent authenticated instructor POST requests to `/api/trips` and `/api/courses` without `centerId`.  
Expected: Record created with `instructorId` set and `centerId` null.  
Actual: Instructor-owned records were created.  
Status: Pass  
Notes: Database confirmation should show `centerId = null`.

### Diving Center Listings

Test: Diving center creates trip/course  
Steps: Sent authenticated center POST requests to `/api/trips` and `/api/courses`.  
Expected: Record created with `centerId` set and `instructorId` null.  
Actual: Center-owned records were created.  
Status: Pass  
Notes: Database confirmation should show `instructorId = null`.

### Ownership Protection

Test: Cross-owner update/delete restrictions  
Steps: Tried instructor actions on center-owned listings and center actions on instructor-owned listings.  
Expected: Non-owner receives `403 Forbidden`.  
Actual: Non-owner requests were blocked.  
Status: Pass  
Notes: Admin can manage any listing.

### Validation

Test: Invalid catalog payloads  
Steps: Sent missing required fields, invalid difficulty, negative price, and invalid date values.  
Expected: `400 Validation failed`.  
Actual: Validation errors returned.  
Status: Pass  
Notes: Validation errors are expected behavior and not server crashes.

### Build Checks

Test: Backend TypeScript and build checks  
Steps: Ran backend typecheck and build commands.  
Expected: Commands complete successfully.  
Actual: Commands completed successfully.  
Status: Pass  
Notes:

```text
npm.cmd run typecheck
npm.cmd run build
```
