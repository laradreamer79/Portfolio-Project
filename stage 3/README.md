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
    participant PaymentGateway
    participant Database

    User->>Frontend: Select an available date and time
    Frontend->>Backend: Submit booking details

    Backend->>PaymentGateway: Create payment session
    PaymentGateway-->>Backend: Return payment session

    Backend-->>Frontend: Redirect to payment
    User->>PaymentGateway: Complete payment
    PaymentGateway-->>Backend: Payment successful

    Backend->>Database: Save booking and mark slot as booked
    Database-->>Backend: Booking confirmed

    Backend-->>Frontend: Return confirmation
    Frontend-->>User: Display booking confirmation
```
