# 3. Create High-Level Sequence Diagrams

## Critical Use Cases

The following sequence diagrams show the main interactions between the user, front-end, back-end, and database for key MVP features in Oyster.

---

## Use Case 1: User Login

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Enter email and password
    Frontend->>Backend: Send login request
    Backend->>Database: Check user credentials
    Database-->>Backend: Return user record
    Backend-->>Frontend: Return authentication response
    Frontend-->>User: Display login success or error message
```

---

## Use Case 2: Browse Diving Centers by City

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Select city
    Frontend->>Backend: Request diving centers by city
    Backend->>Database: Query centers using selected city
    Database-->>Backend: Return matching diving centers
    Backend-->>Frontend: Send centers list
    Frontend-->>User: Display diving centers
```

---

## Use Case 3: Submit Booking Request

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant Database
    participant PaymentGateway

    User->>Frontend: Select available time slot
    Frontend->>Backend: Reserve selected slot
    Backend->>Database: Mark slot as Reserved

    Backend->>PaymentGateway: Create payment session
    PaymentGateway-->>Frontend: Display payment page

    User->>PaymentGateway: Complete payment
    PaymentGateway-->>Backend: Payment successful

    Backend->>Database: Update slot to Booked
    Backend-->>Frontend: Booking confirmed
    Frontend-->>User: Display confirmation
```
