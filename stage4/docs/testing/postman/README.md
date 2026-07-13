# Postman Testing

Use this guide to run Stage 4 API checks in Postman.

## Base URL

```text
http://localhost:3000
```

## Environment Variables

Create a Postman environment with:

| Variable | Purpose |
| --- | --- |
| `BASE_URL` | `http://localhost:3000` |
| `ADMIN_TOKEN` | Admin login token |
| `INSTRUCTOR_TOKEN` | Instructor login token |
| `CENTER_TOKEN` | Diving center login token |
| `USER_TOKEN` | Normal user login token |

## Token Setup

Run:

```http
POST {{BASE_URL}}/api/auth/login
```

Use seeded accounts:

| Role | Email | Password | Save token as |
| --- | --- | --- | --- |
| Admin | `admin@example.com` | `123456` | `ADMIN_TOKEN` |
| Instructor | `instructor@example.com` | `123456` | `INSTRUCTOR_TOKEN` |
| Diving center | `divingcenter@example.com` | `123456` | `CENTER_TOKEN` |
| User | `user@example.com` | `123456` | `USER_TOKEN` |

## Public Catalog Requests

Run without a token:

```http
GET {{BASE_URL}}/api/centers
GET {{BASE_URL}}/api/trips
GET {{BASE_URL}}/api/courses
GET {{BASE_URL}}/api/centers?status=all
GET {{BASE_URL}}/api/trips?status=all
GET {{BASE_URL}}/api/courses?status=all
```

Expected:

- `200 OK`.
- Only approved public records are returned.
- Pending/rejected records are not exposed publicly.

## Search and Filter Requests

```http
GET {{BASE_URL}}/api/centers?city=Jeddah
GET {{BASE_URL}}/api/centers?search=reef
GET {{BASE_URL}}/api/trips?city=Jeddah
GET {{BASE_URL}}/api/trips?difficulty=beginner
GET {{BASE_URL}}/api/trips?minPrice=100&maxPrice=500
GET {{BASE_URL}}/api/trips?search=coral
GET {{BASE_URL}}/api/courses?city=Jeddah
GET {{BASE_URL}}/api/courses?level=beginner
GET {{BASE_URL}}/api/courses?minPrice=100&maxPrice=1000
GET {{BASE_URL}}/api/courses?search=open
```

Expected:

- `200 OK`.
- Matching records or an empty list.
- No server error when there are no results.

## Posting Requests

### Instructor Trip

Token: `INSTRUCTOR_TOKEN`

```http
POST {{BASE_URL}}/api/trips
```

Body:

```text
title: Instructor Trip
description: Independent instructor trip
durationHours: 3
difficultyLevel: beginner
pricePerPerson: 200
maxCapacity: 5
scheduleDate: 2026-08-01T10:00:00.000Z
```

Expected:

- `201 Created`.
- `instructorId` has a value.
- `centerId` is `null`.

### Instructor Course

Token: `INSTRUCTOR_TOKEN`

```http
POST {{BASE_URL}}/api/courses
```

Expected:

- `201 Created`.
- `instructorId` has a value.
- `centerId` is `null`.

### Diving Center Trip/Course

Token: `CENTER_TOKEN`

Expected:

- `201 Created`.
- `centerId` has a value.
- `instructorId` is `null`.

## Validation Requests

Expected `400` responses:

- Missing required field.
- Invalid `difficultyLevel`, such as `expert`.
- Negative price.
- Invalid date.
- Invalid image file type.
- Image larger than 5MB.

## Ownership Requests

Expected:

- Instructor can update/delete own instructor-owned trip/course.
- Instructor receives `403` for center-owned trip/course.
- Diving center can update/delete own center-owned trip/course.
- Diving center receives `403` for instructor-owned trip/course.
- Admin can update/delete any trip/course.

## Evidence Recording

Record evidence as text:

- Request name.
- Status code.
- Short response note.
- Any database confirmation from Prisma Studio.

Screenshots are optional and not required.
