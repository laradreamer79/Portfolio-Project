
# Task 2 – Components, Classes, and Database Design

# Oyster: Diving Platform for Saudi Arabia

---

# 1. Class Diagram (UML)

```mermaid
classDiagram

class User {
    id int
    name string
    email string
    passwordHash string
    role string
    createdAt datetime

    +register() User
    +login() JWT
    +updateProfile() User
    +findById() User
}

class DivingCenter {
    id int
    name string
    city string
    address string
    licenseNumber string
    description string
    priceRange string
    contactEmail string
    contactPhone string
    ownerId int
    createdAt datetime

    +addTrip() Trip
    +addCourse() Course
    +getTrips() List~Trip~
    +getCourses() List~Course~
    +getAverageRating() float
    +addReview() Review
    +findByCity() List~DivingCenter~
}

class Trip {
    id int
    centerId int
    instructorId int
    title string
    description string
    durationHours int
    difficultyLevel string
    pricePerPerson decimal
    maxCapacity int
    scheduleDate date

    +checkAvailability() bool
    +getBookings() List~Booking~
    +getUpcoming() List~Trip~
}

class Course {
    id int
    centerId int
    instructorId int
    title string
    description string
    level string
    price decimal
    startDate date

    +getUpcoming() List~Course~
}

class Booking {
    id int
    userId int
    tripId int
    numberOfPeople int
    totalPrice decimal
    status string
    paymentIntentId string
    createdAt datetime

    +confirmPayment() void
    +cancel() void
    +findByUser() List~Booking~
}

class Payment {
    id int
    bookingId int
    amount decimal
    status string
    paymentMethod string
    stripePaymentId string
    createdAt datetime

    +processPayment() void
    +refund() void
}

class Review {
    id int
    userId int
    centerId int
    tripId int
    rating int
    comment string
    createdAt datetime

    +validate() bool
    +getByCenter() List~Review~
}

User "1" --> "0..*" Booking
User "1" --> "0..*" Review
User "1" --> "0..*" Trip : instructor
User "1" --> "0..*" Course : instructor

DivingCenter "1" --> "0..*" Trip
DivingCenter "1" --> "0..*" Course
DivingCenter "1" --> "0..*" Review

Trip "1" --> "0..*" Booking
Booking "1" --> "1" Payment
```

---

# 2. Backend Class Definitions

## 2.1 User
The User class represents all system actors including regular users, instructors (diving trainers), and administrators.
Access and permissions are controlled using the role attribute (user | instructor | admin).


| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| name : string | Full name |
| email : string | Unique, indexed |
| passwordHash : string | bcrypt hash |
| role : string | user, instructor, or admin |
| createdAt : datetime | Timestamp |
| register() | Creates new user account |
| login() | Returns JWT token |
| updateProfile() | Updates user info |
| findById() | Retrieves user by ID |

## 2.2 DivingCenter

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| name : string | Center name |
| city : string | Saudi city (indexed) |
| address : string | Full address (optional) |
| licenseNumber : string | Unique official license |
| description : string | Overview (optional) |
| priceRange : string | Approximate range (optional) |
| contactEmail : string | Business email (optional) |
| contactPhone : string | Phone number (optional) |
| ownerId : int | FK → users.id |
| createdAt : datetime | Timestamp |
| addTrip() | Creates a new trip |
| addCourse() | Creates a new course |
| getTrips() | Returns all trips for this center |
| getCourses() | Returns all courses for this center |
| getAverageRating() | Computes average rating |
| addReview() | Adds a review |
| findByCity() | Filters centers by city |

## 2.3 Trip

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| centerId : int | FK → diving_centers.id |
| instructorId : int | FK → users.id |
| title : string | Trip name |
| description : string | Details (optional) |
| durationHours : int | In hours (>0) |
| difficultyLevel : string | beginner, intermediate, advanced |
| pricePerPerson : decimal | Price in SAR |
| maxCapacity : int | Maximum divers |
| scheduleDate : date | Trip date |
| checkAvailability() | Returns true if spots left |
| getBookings() | Returns all bookings for this trip |
| getUpcoming() | Returns upcoming trips |

## 2.4 Course

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| centerId : int | FK → diving_centers.id |
| instructorId : int | FK → users.id |
| title : string | Course name |
| description : string | Course details |
| level : string | beginner, intermediate, advanced |
| price : decimal | Price in SAR |
| startDate : date | Course start date |
| getUpcoming() | Returns upcoming courses |

## 2.5 Booking

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| userId : int | FK → users.id |
| tripId : int | FK → trips.id |
| numberOfPeople : int | Participants (>0) |
| totalPrice : decimal | Calculated total |
| status : string | pending, confirmed, cancelled, paid |
| paymentIntentId : string | Stripe ID |
| createdAt : datetime | Booking timestamp |
| confirmPayment() | Updates status to confirmed |
| cancel() | Updates status to cancelled |
| findByUser() | Returns user's bookings |

## 2.6 Payment

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| bookingId : int | FK → bookings.id |
| amount : decimal | Amount paid |
| status : string | pending, succeeded, failed, refunded |
| paymentMethod : string | card, stripe etc. |
| stripePaymentId : string | Stripe payment intent ID |
| createdAt : datetime | Payment timestamp |
| processPayment() | Calls Stripe to charge |
| refund() | Initiates refund via Stripe |

## 2.7 Review

| Attribute / Method | Description |
|----------|----------|
| id : int | Primary key |
| userId : int | FK → users.id |
| centerId : int | FK → diving_centers.id |
| tripId : int | FK → trips.id (nullable) |
| rating : int | 1–5 |
| comment : string | Review text |
| createdAt : datetime | Timestamp |
| validate() | Ensures rating is between 1–5 |
| getByCenter() | Returns reviews for a center |

---

# 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram

users {
    SERIAL id PK
    VARCHAR name
    VARCHAR email UK
    TEXT password_hash
    VARCHAR role
    TIMESTAMP created_at
}

diving_centers {
    SERIAL id PK
    VARCHAR name
    VARCHAR city
    TEXT address
    VARCHAR license_number
    TEXT description
    VARCHAR price_range
    VARCHAR contact_email
    VARCHAR contact_phone
    INT owner_id FK
    TIMESTAMP created_at
}

trips {
    SERIAL id PK
    INT center_id FK
    INT instructor_id FK
    VARCHAR title
    TEXT description
    INT duration_hours
    ENUM difficulty_level
    DECIMAL price_per_person
    INT max_capacity
    DATE schedule_date
}

courses {
    SERIAL id PK
    INT center_id FK
    INT instructor_id FK
    VARCHAR title
    TEXT description
    VARCHAR level
    DECIMAL price
    DATE start_date
}

bookings {
    SERIAL id PK
    INT user_id FK
    INT trip_id FK
    INT number_of_people
    DECIMAL total_price
    ENUM status
    VARCHAR payment_intent_id
    TIMESTAMP created_at
}

payments {
    SERIAL id PK
    INT booking_id FK
    DECIMAL amount
    VARCHAR status
    VARCHAR payment_method
    VARCHAR stripe_payment_id
    TIMESTAMP created_at
}

reviews {
    SERIAL id PK
    INT user_id FK
    INT center_id FK
    INT trip_id FK
    INT rating
    TEXT comment
    TIMESTAMP created_at
}

users ||--o{ bookings : makes
users ||--o{ reviews : writes
users ||--o{ trips : instructs
users ||--o{ courses : teaches

diving_centers ||--o{ trips : offers
diving_centers ||--o{ courses : offers
diving_centers ||--o{ reviews : receives

trips ||--o{ bookings : has
bookings ||--|| payments : has
```

---

# 4. Database Schema

## 4.1 Users Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(100) | NOT NULL | Full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| password_hash | TEXT | NOT NULL | bcrypt hash |
| role | VARCHAR(20) | DEFAULT 'user' | user, instructor, admin |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

## 4.2 Diving Centers Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY | Unique identifier |
| name | VARCHAR(150) | NOT NULL | Center name |
| city | VARCHAR(100) | INDEX, NOT NULL | Saudi city |
| address | TEXT | NULLABLE | Full address |
| license_number | VARCHAR(50) | UNIQUE, NOT NULL | Official license |
| description | TEXT | NULLABLE | Services overview |
| price_range | VARCHAR(50) | NULLABLE | Example: 300–600 SAR |
| contact_email | VARCHAR(255) | NULLABLE | Business email |
| contact_phone | VARCHAR(20) | NULLABLE | Contact phone |
| owner_id | INT | FK → users.id | Center owner |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |

## 4.3 Trips Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY |
| center_id | INT | FK → diving_centers.id ON DELETE CASCADE |
| instructor_id | INT | FK → users.id ON DELETE SET NULL |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NULLABLE |
| duration_hours | INT | CHECK > 0 |
| difficulty_level | ENUM | NOT NULL |
| price_per_person | DECIMAL(10,2) | CHECK > 0 |
| max_capacity | INT | CHECK > 0 |
| schedule_date | DATE | INDEX, NOT NULL |

## 4.4 Courses Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY |
| center_id | INT | FK → diving_centers.id ON DELETE CASCADE |
| instructor_id | INT | FK → users.id ON DELETE SET NULL |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NULLABLE |
| level | VARCHAR(20) | NOT NULL |
| price | DECIMAL(10,2) | CHECK > 0 |
| start_date | DATE | INDEX, NOT NULL |

## 4.5 Bookings Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | FK → users.id ON DELETE CASCADE |
| trip_id | INT | FK → trips.id ON DELETE CASCADE |
| number_of_people | INT | CHECK > 0 |
| total_price | DECIMAL(10,2) | CHECK >= 0 |
| status | ENUM | DEFAULT 'pending' |
| payment_intent_id | VARCHAR(255) | NULLABLE |
| created_at | TIMESTAMP | DEFAULT NOW() |

## 4.6 Payments Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY |
| booking_id | INT | UNIQUE, FK → bookings.id ON DELETE CASCADE |
| amount | DECIMAL(10,2) | CHECK >= 0 |
| status | VARCHAR(20) | NOT NULL |
| payment_method | VARCHAR(50) | NOT NULL |
| stripe_payment_id | VARCHAR(255) | UNIQUE |
| created_at | TIMESTAMP | DEFAULT NOW() |

## 4.7 Reviews Table

| Column | Type | Constraints | Description |
|----------|----------|----------|----------|
| id | SERIAL | PRIMARY KEY |
| user_id | INT | FK → users.id ON DELETE CASCADE |
| center_id | INT | FK → diving_centers.id ON DELETE CASCADE |
| trip_id | INT | FK → trips.id ON DELETE SET NULL |
| rating | INT | CHECK (1–5) |
| comment | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT NOW() |

### Additional Constraint

```sql
UNIQUE (user_id, trip_id)
```

---

# 5. Frontend Component Structure

| Component | Route / Page | Responsibility |
|------------|------------|------------|
| Navbar | Global | Navigation and user menu |
| LoginForm | /login | User authentication |
| RegisterForm | /register | User registration |
| HomePage | / | Search and featured centers |
| CenterCard | /centers | Center summary card |
| CenterList | /centers | Filtered center listing |
| CenterDetails | /centers/:id | Center details, trips, courses, reviews |
| TripList | Inside CenterDetails | Displays available trips |
| CourseList | Inside CenterDetails | Displays available courses |
| BookingForm | /bookings/new | Creates booking for a trip |
| PaymentModal | Global | Stripe payment popup |
| UserDashboard | /dashboard | User bookings and history |
| ReviewForm | /centers/:id/review | Submit reviews |
| AdminPanel | /admin | Manage centers, trips, courses |
| ProtectedRoute | Wrapper | Authentication guard |

---

# 6. Technical Justifications

| Design Decision | Justification |
|----------------|---------------|
| PostgreSQL | Provides strong relational integrity and supports complex queries, joins, and constraints. |
| Index on city, schedule_date, start_date | Speeds up city-based searches and upcoming trip/course listings. |
| ON DELETE CASCADE | Automatically removes dependent records and maintains consistency. |
| ON DELETE SET NULL | Preserves records when referenced entities are deleted. |
| UNIQUE (user_id, trip_id) | Prevents duplicate reviews for the same trip. |
| CHECK constraints | Enforces valid prices, capacities, durations, and ratings. |
| One-to-one Booking–Payment | Ensures each booking has exactly one payment record. |
| ENUM types | Restricts values to predefined options and reduces inconsistency. |
| Stripe IDs | Supports secure payment processing and refunds. |
| Separate Trip and Course tables | Improves clarity, maintainability, and future extensibility. |
