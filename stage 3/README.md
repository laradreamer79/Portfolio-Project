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

    User->>Frontend: Select available date and time
    Frontend->>Backend: Send booking details
    Backend->>Database: Check slot availability
    Database-->>Backend: Slot is available

    Backend->>PaymentGateway: Create payment session
    PaymentGateway-->>Backend: Return payment session

    Backend-->>Frontend: Send payment session
    Frontend-->>User: Redirect to payment page

    User->>PaymentGateway: Complete payment
    PaymentGateway-->>Backend: Confirm successful payment

    Backend->>Database: Save booking as confirmed
    Database-->>Backend: Confirm booking saved

    Backend-->>Frontend: Return booking confirmation
    Frontend-->>User: Display successful booking message
```
