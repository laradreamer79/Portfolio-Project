# Stage 4 Test Plan

## Objective

Verify that all implemented Stage 4 features work as expected across frontend pages, backend APIs, authentication, role access, catalog posting, image upload, bookings, reviews, payments, and admin functionality.

## Test Environment

| Item | Value |
| --- | --- |
| Backend | Express, TypeScript, Prisma, PostgreSQL |
| Frontend | React, Vite, TypeScript |
| Base API URL | `http://localhost:3000` |
| Frontend URL | `http://localhost:5173` |
| API tool | Postman |
| Database verification | Prisma Studio |

## Test Accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `123456` |
| User | `user@example.com` | `123456` |
| Instructor | `instructor@example.com` | `123456` |
| Diving center | `divingcenter@example.com` | `123456` |

## Required Test Record Fields

Each documented test should include:

| Field | Description |
| --- | --- |
| Test name | Short name for the scenario |
| Preconditions | Required user, token, data, or server state |
| Steps | What was executed |
| Expected result | Correct behavior |
| Actual result | Observed behavior |
| Status | Pass, Fail, or Blocked |
| Evidence | Text note, command output note, Postman request name, or database confirmation |
| Related issue/PR | Link or identifier when available |

## Coverage Areas

### Authentication

- Register.
- Login.
- Logout.
- Token storage.
- Invalid credentials.
- Role-based redirects.
- Diver/user registration.
- Instructor registration with license number.
- Diving center registration with center details.

### Catalog

- Home page real data.
- Centers page.
- Trips page.
- Courses page.
- Detail pages.
- Search/filter behavior.
- Public visibility for approved records only.
- Owner/admin visibility for allowed non-approved records.

### Posting Trips and Courses

- Instructor dashboard add trip.
- Instructor dashboard add course.
- Diving center dashboard add trip.
- Diving center dashboard add course.
- Required image upload.
- Listing appears after posting.

### Image Upload

- Required image validation.
- Successful Cloudinary upload.
- Uploaded image appears in catalog/detail pages.
- Invalid file type rejected.
- File over 5MB rejected.

### Booking and Review APIs

- Create booking.
- Prevent invalid booking.
- Create review.
- Filter reviews by center/trip/course.
- Validation errors.

### Payment API

- Mock payment mode.
- Create payment.
- Get payment by ID.
- Admin list payments.
- Webhook behavior.
- Missing/invalid payment config errors.

### Admin

- Admin-only access.
- Non-admin blocked.
- Centers, reviews, bookings, and payment data where applicable.

## Completion Criteria

Stage 4 testing is complete when:

- Core frontend routes load without blank screens.
- Authentication and role-specific flows pass.
- Catalog APIs return expected data and enforce visibility rules.
- Instructor and diving center posting flows pass.
- Image upload validation and Cloudinary upload behavior are documented.
- Booking, review, payment, and admin APIs have pass/fail notes.
- Evidence notes are recorded under `stage4/docs/testing/evidence`.
