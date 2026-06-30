## 4. API Specifications

### 1. External APIs

The Oyster platform relies on several third-party services to provide additional functionality and reduce infrastructure complexity.

| External API | Purpose | Justification |
|--------------|---------|---------------|
| Cloudinary API | Store and deliver images | Eliminates the need for local file storage and provides CDN optimization |
| Moyasar Payment API | Process secure online payments | Supports local Saudi payment methods such as mada and Apple Pay |
| Calendly API | Schedule diving sessions and appointments | Simplifies booking and scheduling processes by allowing users to select available time slots without building a custom scheduling system |

### 2. Internal REST APIs

The backend exposes RESTful API endpoints that allow the frontend to communicate with the server using JSON.

---

### Home APIs

##### Get Home Data

| Property | Value |
|----------|--------|
| URL | `/api/home` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "featuredTrips": [],
  "featuredCenters": [],
  "statistics": {
    "centers": 25,
    "trips": 80,
    "courses": 18
  }
}
```

---

### Authentication APIs

##### Register User

| Property | Value |
|----------|--------|
| URL | `/api/auth/register` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "name": "Solaf Alessa",
  "email": "solaf@gmail.com",
  "password": "123456"
}
```

###### Response

```json
{
  "message": "User registered successfully"
}
```

##### Login User

| Property | Value |
|----------|--------|
| URL | `/api/auth/login` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "email": "solaf@gmail.com",
  "password": "123456"
}
```

###### Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

### Diving Centers APIs

| Route | Page | Responsibility |
|---------|------|---------------|
| `/dashboard` | Center Dashboard | Allows diving center owners to manage bookings, trips, courses, and center information. |

##### Get All Diving Centers

| Property | Value |
|----------|--------|
| URL | `/api/centers` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "id": 1,
    "name": "Red Sea Diving Center",
    "city": "Jeddah"
  }
]
```

##### Get Diving Center Details

| Property | Value |
|----------|--------|
| URL | `/api/centers/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "id": 1,
  "name": "Red Sea Diving Center",
  "city": "Jeddah",
  "description": "Professional diving center",
  "priceRange": "300-600 SAR",
  "contactPhone": "+966500000000"
}
```

##### Search Centers by City

| Property | Value |
|----------|--------|
| URL | `/api/centers?city=Jeddah` |
| Method | GET |
| Input Format | Query Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

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

### Trips APIs

##### Get All Trips

| Property | Value |
|----------|--------|
| URL | `/api/trips` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "id": 5,
    "title": "Coral Reef Dive",
    "city": "Jeddah",
    "price": 350
  }
]
```

##### Get Trip Details

| Property | Value |
|----------|--------|
| URL | `/api/trips/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "id": 5,
  "title": "Coral Reef Dive",
  "description": "Explore coral reefs",
  "city": "Jeddah",
  "price": 350,
  "difficulty": "Beginner"
}
```

##### Get Trips for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/centers/:centerId/trips` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "id": 5,
    "title": "Coral Reef Dive"
  }
]
```

---

### Courses APIs

##### Get All Courses

| Property | Value |
|----------|--------|
| URL | `/api/courses` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "id": 2,
    "title": "Open Water Diver",
    "level": "Beginner",
    "price": 1200
  }
]
```

##### Get Courses for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/centers/:centerId/courses` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "id": 2,
    "title": "Open Water Diver"
  }
]
```

---

### About APIs

##### Get About Information

| Property | Value |
|----------|--------|
| URL | `/api/about` |
| Method | GET |
| Input Format | None |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "mission": "Promote marine tourism in Saudi Arabia",
  "vision": "Support Vision 2030"
}
```

---

### Booking APIs

##### Create Booking

| Property | Value |
|----------|--------|
| URL | `/api/bookings` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "tripId": 5,
  "numberOfPeople": 2
}
```

###### Response

```json
{
  "message": "Booking created successfully"
}
```

##### Create Course Booking

| Property | Value |
|----------|--------|
| URL | `/api/bookings` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "courseId": 2,
  "numberOfPeople": 2
}
```

###### Response

```json
{
  "message": "Course booking created successfully"
}
```

##### Get Booking Details

| Property | Value |
|----------|--------|
| URL | `/api/bookings/:bookingId` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "bookingId": 15,
  "tripId": 5,
  "numberOfPeople": 2,
  "status": "Confirmed"
}
```

##### Get User Bookings

| Property | Value |
|----------|--------|
| URL | `/api/bookings/user/:id` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "bookingId": 15,
    "tripId": 5,
    "status": "Confirmed"
  }
]
```

##### Cancel Booking

| Property | Value |
|----------|--------|
| URL | `/api/bookings/:id` |
| Method | DELETE |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Booking cancelled successfully"
}
```

---

### Payment APIs

##### Process Payment

| Property | Value |
|----------|--------|
| URL | `/api/payments` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "bookingId": 10,
  "paymentMethod": "mada"
}
```

###### Response

```json
{
  "message": "Payment processed successfully"
}
```

###### Failed Response

```json
{
  "message": "Payment failed"
}
```

---

### Reviews APIs

##### Add Review

| Property | Value |
|----------|--------|
| URL | `/api/reviews` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "centerId": 1,
  "rating": 5,
  "comment": "Excellent experience"
}
```

###### Response

```json
{
  "message": "Review submitted successfully"
}
```

##### Get Reviews for a Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/reviews/:centerId` |
| Method | GET |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
[
  {
    "user": "Ahmed",
    "rating": 5,
    "comment": "Excellent experience"
  }
]
```

---

### Admin APIs

| Route | Page | Responsibility |
|---------|------|---------------|
| `/admin` | Admin Dashboard | Allows administrators to manage users, diving centers, and overall platform content. |

##### Add Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers` |
| Method | POST |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "name": "Red Sea Diving Center",
  "city": "Jeddah",
  "description": "Professional diving center offering diving trips and training courses.",
  "contactPhone": "+966500000000",
  "priceRange": "300-600 SAR"
}
```

###### Response

```json
{
  "message": "Diving center added successfully"
}
```

##### Update Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers/:id` |
| Method | PUT |
| Input Format | JSON |
| Output Format | JSON |

###### Request

```json
{
  "name": "Red Sea Diving Center",
  "city": "Jeddah",
  "description": "Updated diving center information.",
  "contactPhone": "+966500000000",
  "priceRange": "350-650 SAR"
}
```

###### Response

```json
{
  "message": "Diving center updated successfully"
}
```

##### Delete Diving Center

| Property | Value |
|----------|--------|
| URL | `/api/admin/centers/:id` |
| Method | DELETE |
| Input Format | URL Parameter |
| Output Format | JSON |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Diving center deleted successfully"
}
```

---

### Approve Instructor Registration

| Property      | Value                                 |
| ------------- | ------------------------------------- |
| URL           | `/api/admin/instructors/{id}/approve` |
| Method        | PATCH                                 |
| Input Format  | JSON                                  |
| Output Format | JSON                                  |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Instructor approved successfully.",
  "status": "approved"
}
```

### Approve Diving Center Application

| Property      | Value                                    |
| ------------- | ---------------------------------------- |
| URL           | `/api/admin/diving-centers/{id}/approve` |
| Method        | PATCH                                    |
| Input Format  | JSON                                     |
| Output Format | JSON                                     |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Diving center application approved successfully.",
  "status": "approved"
}
```

### Reject Diving Center Application

| Property      | Value                                   |
| ------------- | --------------------------------------- |
| URL           | `/api/admin/diving-centers/{id}/reject` |
| Method        | PATCH                                   |
| Input Format  | JSON                                    |
| Output Format | JSON                                    |

###### Request

```json
{
  "reason": "Business license is invalid."
}
```

###### Response

```json
{
  "message": "Diving center application rejected successfully.",
  "status": "rejected"
}
```

### Reject Instructor Registration

| Property      | Value                                |
| ------------- | ------------------------------------ |
| URL           | `/api/admin/instructors/{id}/reject` |
| Method        | PATCH                                |
| Input Format  | JSON                                 |
| Output Format | JSON                                 |

###### Request

```json
{
  "reason": "Certification documents could not be verified."
}
```

###### Response

```json
{
  "message": "Instructor registration rejected successfully.",
  "status": "rejected"
}
```

---

### Instructor APIs

##### Register Instructor

| Property      | Value                       |
| ------------- | --------------------------- |
| URL           | `/api/instructors/register` |
| Method        | POST                        |
| Input Format  | JSON                        |
| Output Format | JSON                        |

###### Request

```json
{
  "fullName": "Ahmed Alqahtani",
  "email": "ahmed@example.com",
  "password": "123456",
  "phone": "+966500000000",
  "certification": "PADI Open Water Scuba Instructor",
  "certificationNumber": "PADI-123456"
}
```

###### Response

```json
{
  "id": 8,
  "message": "Instructor registration submitted successfully. Your account is pending admin approval.",
  "status": "pending"
}
```
##### Create Trip

| Property      | Value                    |
| ------------- | ------------------------ |
| URL           | `/api/instructors/trips` |
| Method        | POST                     |
| Input Format  | JSON                     |
| Output Format | JSON                     |

###### Request

```json
{
  "title": "Coral Reef Dive",
  "location": "Jeddah",
  "date": "2026-08-15",
  "maxParticipants": 8,
  "price": 350
}
```

###### Response

```json
{
  "id": 12,
  "message": "Trip created successfully and submitted for admin approval.",
  "status": "pending"
}
```

##### Create Course

| Property      | Value                      |
| ------------- | -------------------------- |
| URL           | `/api/instructors/courses` |
| Method        | POST                       |
| Input Format  | JSON                       |
| Output Format | JSON                       |

###### Request

```json
{
  "title": "Open Water Diver",
  "level": "Beginner",
  "durationDays": 4,
  "price": 1200,
  "maxParticipants": 6
}
```

###### Response

```json
{
  "id": 7,
  "message": "Course created successfully and submitted for admin approval.",
  "status": "pending"
}
```
##### Delete Trip

| Property      | Value                         |
| ------------- | ----------------------------- |
| URL           | `/api/instructors/trips/{id}` |
| Method        | DELETE                        |
| Input Format  | None                          |
| Output Format | JSON                          |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Trip deleted successfully."
}
```

##### Delete Course

| Property      | Value                           |
| ------------- | ------------------------------- |
| URL           | `/api/instructors/courses/{id}` |
| Method        | DELETE                          |
| Input Format  | None                            |
| Output Format | JSON                            |

###### Request

```json
{}
```

###### Response

```json
{
  "message": "Course deleted successfully."
}
```

##### Update Trip

| Property      | Value                         |
| ------------- | ----------------------------- |
| URL           | `/api/instructors/trips/{id}` |
| Method        | PUT                           |
| Input Format  | JSON                          |
| Output Format | JSON                          |

###### Request

```json
{
  "title": "Coral Reef Dive",
  "location": "Jeddah",
  "date": "2026-08-20",
  "maxParticipants": 10,
  "price": 400
}
```

###### Response

```json
{
  "message": "Trip updated successfully and submitted for admin approval.",
  "status": "pending"
}
```

##### Update Course

| Property      | Value                           |
| ------------- | ------------------------------- |
| URL           | `/api/instructors/courses/{id}` |
| Method        | PUT                             |
| Input Format  | JSON                            |
| Output Format | JSON                            |

###### Request

```json
{
  "title": "Open Water Diver",
  "level": "Beginner",
  "durationDays": 5,
  "price": 1300,
  "maxParticipants": 8
}
```

###### Response

```json
{
  "message": "Course updated successfully and submitted for admin approval.",
  "status": "pending"
}
```
