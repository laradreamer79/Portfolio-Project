# Task 4 – Document External and Internal APIs

---

# 1. External APIs

The Oyster platform relies on several third-party services to provide additional functionality and reduce infrastructure complexity.

| External API | Purpose | Justification |
|--------------|---------|---------------|
| Cloudinary API | Store and deliver images | Eliminates the need for local file storage and provides CDN optimization |
| Calendly API | Schedule diving sessions and appointments | Simplifies booking and scheduling processes by allowing users to select available time slots without building a custom scheduling system |
| Moyasar Payment API | Process secure online payments | Supports local Saudi payment methods such as mada and Apple Pay |

---

# 2. Internal REST APIs

The backend exposes RESTful API endpoints that allow the frontend to communicate with the server using JSON.

---

## Home APIs

### Get Home Data

| Property | Value |
|----------|--------|
| URL | `/api/home` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

---

## Authentication APIs

### Register User

| Property | Value |
|----------|--------|
| URL | `/api/auth/register` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

### Request

```json
{
  "name": "Solaf Alessa",
  "email": "solaf@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "message": "User registered successfully"
}
```

---

### Login User

| Property | Value |
|----------|--------|
| URL | `/api/auth/login` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

### Request

```json
{
  "email": "solaf@gmail.com",
  "password": "123456"
}
```

### Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

## Diving Centers APIs

| Route | Page | Responsibility |
|---------|------|---------------|
| `/dashboard` | Center Dashboard | Allows diving center owners to manage bookings, trips, courses, and center information. |

### Get All Diving Centers

| Property | Value |
|----------|--------|
| URL | `/api/centers` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

### Response

```json
[
  {
    "id": 1,
    "name": "Red Sea Diving Center",
    "city": "Jeddah"
  }
]
```

---

### Get Diving Center Details

| Property | Value |
|----------|--------|
| URL | `/api/centers/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

### Search Centers by City

| Property | Value |
|----------|--------|
| URL | `/api/centers?city=Jeddah` |
| Method | GET |
| Input Format | Query Parameter |
| Output Format | JSON |

---

## Trips APIs

### Get All Trips

| Property | Value |
|----------|--------|
| URL | `/api/trips` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

---

### Get Trip Details

| Property | Value |
|----------|--------|
| URL | `/api/trips/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

### Get Trips for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/centers/:centerId/trips` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

## Courses APIs

### Get All Courses

| Property | Value |
|----------|--------|
| URL | `/api/courses` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

---

### Get Courses for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/centers/:centerId/courses` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

## About APIs

### Get About Information

| Property | Value |
|----------|--------|
| URL | `/api/about` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

---

## Booking APIs

### Create Booking

| Property | Value |
|----------|--------|
| URL | `/api/bookings` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

### Request

```json
{
  "tripId": 5,
  "numberOfPeople": 2
}
```

### Response

```json
{
  "message": "Booking created successfully"
}
```

---

### Get Booking Details

| Property | Value |
|----------|--------|
| URL | `/api/bookings/:bookingId` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

### Get User Bookings

| Property | Value |
|----------|--------|
| URL | `/api/bookings/user/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

### Cancel Booking

| Property | Value |
|----------|--------|
| URL | `/api/bookings/:id` |
| Method | DELETE |
| Input Format | URL Parameter |
| Output Format | JSON |

---

## Dashboard APIs

### Get Center Dashboard Data

| Property | Value |
|----------|--------|
| URL | `/api/dashboard/center` |
| Method | GET |
| Input Format | JWT Token |
| Output Format | JSON |

---

## Payment APIs

### Process Payment

| Property | Value |
|----------|--------|
| URL | `/api/payments` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

### Request

```json
{
  "bookingId": 10,
  "paymentMethod": "mada"
}
```

### Response

```json
{
  "message": "Payment processed successfully"
}
```

---

## Reviews APIs

### Add Review

| Property | Value |
|----------|--------|
| URL | `/api/reviews` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

### Request

```json
{
  "centerId": 1,
  "rating": 5,
  "comment": "Excellent experience"
}
```

### Response

```json
{
  "message": "Review submitted successfully"
}
```

---

### Get Reviews for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/reviews/:centerId` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

---

## Admin APIs

| Route | Page | Responsibility |
|---------|------|---------------|
| `/admin` | Admin Dashboard | Allows administrators to manage users, diving centers, and overall platform content. |

### Add Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

---

### Update Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers/:id` |
| Method | PUT |
| Input Format | JSON |
| Output Format | JSON |

---

### Delete Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers/:id` |
| Method | DELETE |
| Input Format | URL Parameter |
| Output Format | JSON |

---

# Technical Justifications

| Technology | Justification |
|------------|---------------|
| REST API | Simple, scalable, and widely adopted architecture |
| JSON Format | Lightweight and easy for frontend and backend communication |
| JWT Authentication | Secure stateless authentication mechanism |
| Moyasar API | Supports secure online payments and local Saudi payment methods |
| Cloudinary | Efficient cloud image hosting and optimization |
| Calendly API | Provides an easy scheduling solution and avoids building a custom booking system |

---

*Stage 3 – Technical Documentation | Oyster Platform | Solaf ALessa*
