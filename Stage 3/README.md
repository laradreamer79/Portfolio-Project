# Stage 3: Technical Documentation — Oyster 🌊

## Task 1: System Architecture

---

### Overview

This document defines the high-level system architecture for **Oyster**, a digital platform connecting divers and tourists with diving centers and trips across Saudi Arabia.

The architecture follows a standard **3-tier web application** model: Frontend, Backend, and Database — with integration to external third-party services.

---

## Architecture Diagram

```
+------------------+     +--------------------+     +------------------+
|     Diver /      |     |   Diving Center    |     |     Admin        |
|     Tourist      |     |   (Provider)       |     |   (Platform)     |
+------------------+     +--------------------+     +------------------+
         |                        |                         |
         +------------------------+-------------------------+
                                  |
                          HTTPS Requests
                                  |
                                  v
         +--------------------------------------------------+
         |              Frontend — React.js                 |
         |                                                  |
         |  • Home / Browse Centers by City                 |
         |  • Center Details (Trips, Reviews)               |
         |  • User Registration & Login                     |
         |  • Booking Request Form                          |
         |  • Ratings & Reviews                             |
         |  • Admin Dashboard                               |
         |  • Diving Center Dashboard                       |
         +--------------------------------------------------+
                                  |
                          REST API (JSON)
                                  |
                                  v
         +--------------------------------------------------+
         |           Backend — Node.js / Express            |
         |                                                  |
         |  • Authentication & Authorization (JWT)          |
         |  • Centers Management                            |
         |  • Trips Management                              |
         |  • Booking Request Handling                      |
         |  • Ratings & Reviews Logic                       |
         |  • Admin Controls                                |
         |  • Search & Filter Logic                         |
         +--------------------------------------------------+
                   |                           |
           PostgreSQL Queries             API Calls
                   |                           |
                   v                           v
    +---------------------+       +------------------------+
    |     PostgreSQL      |       |    External Services   |
    |                     |       |                        |
    |  • users            |       |  • Google Maps API     |
    |  • diving_centers   |       |    (Center Locations)  |
    |  • trips            |       |                        |
    |  • bookings         |       |  • Cloudinary          |
    |  • reviews          |       |    (Image Storage)     |
    |                     |       |                        |
    +---------------------+       |  • Nodemailer          |
                                  |    (Email Notifications)|
                                  +------------------------+
```

---

## Component Descriptions

| Component | Technology | Role |
|-----------|------------|------|
| **Frontend** | React.js | Renders the user interface. Handles all user interactions: browsing, searching, booking, and reviews. Communicates with the backend via REST API calls. |
| **Backend** | Node.js + Express | Processes all business logic. Handles authentication, data validation, and communication between the frontend and the database. Exposes RESTful API endpoints. |
| **Database** | PostgreSQL | Stores all application data: users, diving centers, trips, bookings, and reviews. Uses relational tables with foreign key constraints to enforce data integrity. |
| **Auth Layer** | JWT (JSON Web Tokens) | Manages stateless authentication. Issues tokens on login, verifies identity on protected routes. Supports 3 roles: Diver, Diving Center, Admin. |
| **Image Storage** | Cloudinary | Stores and serves images for diving centers and trips. Provides CDN delivery and automatic optimization. |
| **Map Service** | Google Maps API | Displays the geographical location of diving centers on an interactive map. Supports filtering by city/region. |
| **Email Service** | Nodemailer | Sends booking confirmation and notification emails to users and diving centers. |

---

## Data Flow

The following steps describe how data moves through the system for a typical user interaction:

1. The user (Diver, Diving Center, or Admin) opens the platform in a web browser.
2. **React.js** renders the UI and sends HTTP requests to the backend API over HTTPS.
3. **Express.js** receives the request, validates the JWT token (if required), and processes the business logic.
4. The backend queries **PostgreSQL** to retrieve or store relational data.
5. PostgreSQL returns the result to the backend, which formats it as a **JSON response**.
6. React.js receives the JSON and renders the updated UI to the user.
7. When images are involved, they are fetched directly from **Cloudinary** via CDN URLs.
8. When map data is needed, the frontend calls the **Google Maps API** directly using the center's coordinates stored in PostgreSQL.
9. When a booking is confirmed, the backend triggers **Nodemailer** to send a confirmation email.

---

## Deployment Architecture

| Environment | Description |
|-------------|-------------|
| **Development** | Local machines — each developer runs the full stack locally using Node.js and PostgreSQL |
| **Staging** | Pre-production environment used for testing before release |
| **Production** | Deployed on a cloud platform (e.g., Render or Railway for backend, Vercel for frontend) |

---

## Technical Justifications

Every technology in this architecture was chosen based on the team's functional requirements, non-functional requirements, and project constraints.

| Technology | Decision | Justification |
|------------|----------|---------------|
| **React.js** | Frontend Framework | The team has foundational knowledge in HTML/CSS/JS. React is a natural progression that enables component-based UI development, fast rendering, and a large ecosystem of libraries. Suitable for building dynamic interfaces like center listings and booking forms. |
| **Node.js + Express** | Backend Framework | Using the same language (JavaScript) for both frontend and backend reduces context-switching and learning overhead for a 4-person student team. Express is lightweight and well-suited for building RESTful APIs quickly. |
| **PostgreSQL** | Database | A relational database was chosen over a non-relational one for Oyster's core data model. <br><br>**PostgreSQL** (Relational — interconnected tables): Best suited for a booking-based platform because it enforces strong relationships between users, diving centers, and bookings, and guarantees data integrity (e.g., a booking cannot exist without a valid user). Foreign key constraints prevent orphaned or invalid records. <br><br>**MongoDB** (Non-relational — JSON documents): Was considered but not selected, as it does not enforce relational integrity by default, which is riskier for a system where bookings must always be tied to a valid user and trip. |
| **JWT** | Authentication | Stateless authentication eliminates the need for session management on the server. JWT tokens support role-based access control for 3 user types: Diver, Diving Center Admin, and Platform Admin. |
| **Google Maps API** | Location Service | Provides accurate map data for Saudi Arabian cities and coastal regions. Required by the user story: "As a user, I want to browse diving centers by city." Well-documented and easy to integrate with React. |
| **Cloudinary** | Image Hosting | Provides a free-tier CDN for image storage and delivery. Eliminates the need to manage file storage infrastructure. Supports automatic image optimization and resizing — essential for center profile images and trip photos. |
| **Nodemailer** | Email Notifications | A lightweight and free Node.js library for sending transactional emails. Covers the requirement for booking confirmation emails without the cost of a paid email API at MVP stage. |

---

## Non-Functional Requirements Addressed

| Requirement | How the Architecture Addresses It |
|-------------|----------------------------------|
| **Performance** | React's virtual DOM minimizes re-renders. Cloudinary CDN reduces image load times. |
| **Scalability** | PostgreSQL supports indexing and read replicas for horizontal read scaling. Node.js handles concurrent requests efficiently with its non-blocking I/O model. |
| **Security** | JWT ensures only authenticated users access protected routes. HTTPS encrypts all client-server communication. Passwords are hashed using bcrypt. |
| **Maintainability** | Separation of concerns: frontend, backend, and database are fully decoupled. Each layer can be updated independently. |
| **Usability** | React enables a responsive, fast UI. Google Maps provides familiar, intuitive location browsing. |

---

*Stage 3 — Technical Documentation | Oyster Platform | Holberton School SAU-0825 · 2026*  
*Author: Ebtihal Alomari*
