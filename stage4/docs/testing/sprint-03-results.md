# Sprint 3 Test Results

Sprint 3 focused on catalog APIs, posting trips/courses, image upload, booking/review APIs, payment APIs, and admin API behavior.

## Summary

| Area | Status | Evidence |
| --- | --- | --- |
| Catalog APIs | Pass | Postman catalog requests |
| Posting trips/courses | Pass | Postman create requests |
| Image upload | Pass | Multipart upload notes |
| Bookings and reviews | Pass | Postman API notes |
| Payment API | Pass | Mock payment API notes |
| Admin routes | Pass | Admin and non-admin access checks |

## Catalog API Results

| Test name | Preconditions | Steps | Expected result | Actual result | Status | Evidence | Related issue/PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| List centers | Backend running | `GET /api/centers` | `200 OK`, approved centers returned | Returned expected list | Pass | Postman catalog request | N/A |
| List trips | Backend running | `GET /api/trips` | `200 OK`, approved trips returned | Returned expected list | Pass | Postman catalog request | N/A |
| List courses | Backend running | `GET /api/courses` | `200 OK`, approved courses returned | Returned expected list | Pass | Postman catalog request | N/A |
| Detail pages API | Seed data exists | `GET /api/centers/:id`, `/api/trips/:id`, `/api/courses/:id` | Approved detail returns `200` | Detail records returned | Pass | Postman detail requests | N/A |
| Search/filter behavior | Seed data exists | Apply city/search/level/difficulty/price filters | `200 OK`, matching or empty list | Filters returned expected lists | Pass | Postman filter requests | N/A |

## Posting and Image Upload Results

| Test name | Preconditions | Steps | Expected result | Actual result | Status | Evidence | Related issue/PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Instructor adds trip | Instructor token available | `POST /api/trips` with valid data | `201 Created` | Trip created | Pass | Postman create request | N/A |
| Instructor adds course | Instructor token available | `POST /api/courses` with valid data | `201 Created` | Course created | Pass | Postman create request | N/A |
| Diving center adds trip | Center token available | `POST /api/trips` with valid data | `201 Created` | Trip created | Pass | Postman create request | N/A |
| Diving center adds course | Center token available | `POST /api/courses` with valid data | `201 Created` | Course created | Pass | Postman create request | N/A |
| Required image upload | Posting form/API supports image | Submit multipart request with image | Image accepted and URL saved | `imageUrl` saved when image sent | Pass | Postman multipart note | N/A |
| Cloudinary upload | Cloudinary env configured | Submit JPEG/PNG/WEBP image | Cloudinary URL returned | URL returned in response | Pass | Postman response note | N/A |
| Invalid file type | Backend running | Upload PDF as image | Request rejected | Upload rejected | Pass | Postman invalid file note | N/A |

## Booking, Review, Payment, and Admin Results

| Test name | Preconditions | Steps | Expected result | Actual result | Status | Evidence | Related issue/PR |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Create booking | User token and listing exist | `POST /api/bookings` | Booking created | Booking created | Pass | Postman booking request | N/A |
| Prevent invalid booking | User token available | Submit invalid booking payload | Validation error | Error returned | Pass | Postman validation request | N/A |
| Create review | User token and target exist | `POST /api/reviews` | Review created | Review created | Pass | Postman review request | N/A |
| Filter reviews | Reviews exist | Filter by center/trip/course | Matching reviews returned | Filtered list returned | Pass | Postman review filter requests | N/A |
| Create payment | Booking exists | `POST /api/payments` | Mock payment created | Payment created | Pass | Postman payment request | N/A |
| Get payment by ID | Payment exists | `GET /api/payments/:id` | Payment returned | Payment returned | Pass | Postman payment detail request | N/A |
| Admin list payments | Admin token available | `GET /api/payments` | Payments returned | Payments returned for admin | Pass | Postman admin payment request | N/A |
| Payment webhook | Backend running | Send webhook payload | Webhook handled or validation error returned | Behavior documented | Pass | Postman webhook request | N/A |
| Admin-only routes | Admin and non-admin tokens available | Call admin APIs | Admin allowed, non-admin blocked | Expected status codes returned | Pass | Postman admin access requests | N/A |

## Notes

- Evidence for this sprint is recorded as Postman request names, status codes, and response observations.
- Screenshots are not required.
