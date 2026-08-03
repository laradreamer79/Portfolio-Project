# Stage 5: Final Report

## Table of Contents

- [Team Members](#team-members)
- [Portfolio Landing Page Deliverables](#portfolio-landing-page-deliverables)
- [Results Summary](#results-summary)
- [Lessons Learned](#lessons-learned)
- [Team Retrospective](#team-retrospective)

---

## Team Members

| Team Member | Role |
|---|---|
| [Lara Alzannan] | Project Manager / Frontend Developer |
| [Ebtihal Alomari] | Frontend Developer |
| [Maryam Alessa] | Backend Developer |
| [Solaf Alessa] | Backend Developer |

---

## Portfolio Landing Page Deliverables

### 1. Landing Page URL

[Visit the live Oyster landing page](https://laradreamer79.github.io/Portfolio-Project/)

### 2. YouTube Demo Video

[Watch the Oyster demo on YouTube](https://youtu.be/texwZajNdWk)

### 3. Project Presentation

[View the Oyster project presentation on Google Slides](https://docs.google.com/presentation/d/15Bplel9c8NmltdiD-OAtgAIrDe_n9aFi/edit?slide=id.p1#slide=id.p1)

### 4. Project Repository

[Oyster Portfolio Project on GitHub](https://github.com/laradreamer79/Portfolio-Project)

### 5. Team GitHub Profiles

| Team Member | GitHub Profile |
|---|---|
| Lara Alzannan | [laradreamer79](https://github.com/laradreamer79) |
| Ebtihal Alomari | [bakosh2](https://github.com/bakosh2) |
| Maryam Alessa | [maryam13188](https://github.com/maryam13188) |
| Solaf Alessa | [lilsouy](https://github.com/lilsouy) |

> The landing-page **About** section contains the project story and team details. LinkedIn and X/Twitter links will be added when the team provides their profile URLs.

---

# Results Summary

## Project Overview

Oyster is a web platform designed to support the diving community by helping users discover diving centers, trips, and courses in Saudi Arabia.

The platform enables users to:

- Register and log in based on role.
- Browse diving centers, trips, and courses.
- Search and filter catalog listings.
- View detail pages for centers, trips, and courses.
- Book available trips and courses.
- Add reviews.
- Allow instructors and diving centers to post and manage their own trips and courses.
- Allow admins to access protected management data through an admin dashboard.

The MVP focuses on creating a clear connection between divers, instructors, and diving centers while providing a structured catalog and booking experience.

---

## Project Journey Overview

The Oyster project progressed through five structured stages, starting from the initial idea and ending with a functional MVP and final project reflection.

### Stage 1: Ideation

The team identified a need for a centralized platform for diving activities. The idea focused on helping users discover trusted diving centers, available trips, and diving courses in one place.

### Stage 2: Planning

During the planning stage, the team defined the project scope, main users, MVP objectives, stakeholders, risks, and initial feature priorities. The team also prepared the Project Charter and planned the development roadmap.

### Stage 3: Technical Documentation

The team documented the technical foundation of the project, including architecture, database design, API planning, user flows, and system workflows. This stage helped clarify how the frontend, backend, and database would work together.

### Stage 4: Development and Testing

The MVP was implemented using React, Express, TypeScript, PostgreSQL, Prisma, Cloudinary, and payment integration support. Core features were developed and tested, including authentication, catalog APIs, dashboards, booking, reviews, payments, image upload, admin routes, validation, and automated testing.

### Stage 5: Closure and Reflection

The final stage focuses on documenting the final results, reflecting on team performance, preparing the final presentation, and demonstrating the MVP to stakeholders and tutors.

---

##  MVP Feature Completion

| Feature | Planned | Delivered | Status |
|---|---|---|---|
| User Registration and Login | Yes | Yes | Complete |
| Role-Based Access | Yes | Yes | Complete |
| Diver/User Registration | Yes | Yes | Complete |
| Instructor Registration | Yes | Yes | Complete |
| Diving Center Registration | Yes | Yes | Complete |
| Centers Catalog | Yes | Yes | Complete |
| Trips Catalog | Yes | Yes | Complete |
| Courses Catalog | Yes | Yes | Complete |
| Search and Filters | Yes | Yes | Complete |
| Center Detail Pages | Yes | Yes | Complete |
| Trip Detail Pages | Yes | Yes | Complete |
| Course Detail Pages | Yes | Yes | Complete |
| Instructor Dashboard | Yes | Yes | Complete |
| Diving Center Dashboard | Yes | Yes | Complete |
| Add Trips | Yes | Yes | Complete |
| Add Courses | Yes | Yes | Complete |
| Image Upload | Yes | Yes | Complete |
| Booking API | Yes | Yes | Complete |
| Reviews API | Yes | Yes | Complete |
| Payment API | Yes | Yes | Complete |
| Admin Dashboard | Yes | Yes | Complete |
| Automated Tests | Yes | Yes | Complete |
| Testing Documentation | Yes | Yes | Complete |
| Production Environment Documentation | Yes | Yes | Complete |

---

## SMART Objectives Evaluation

| Objective | Target | Result |
|---|---|---|
| User Access | Users can register, log in, and access role-specific pages | Authentication and role-based redirects were implemented and tested |
| Catalog Browsing | Users can browse centers, trips, and courses | Catalog pages were connected to real backend data |
| Search and Filtering | Users can search and filter listings | Search and filters were implemented for catalog pages |
| Listing Management | Centers and instructors can create trips and courses | Dashboards support posting and managing listings |
| Booking Flow | Users can create bookings for trips or courses | Booking API and frontend booking flow were implemented |
| Reviews | Users can add and view reviews | Review creation and filtering by center, trip, and course were implemented |
| Payment Support | Users can create payments for bookings | Payment API supports mock mode, payment lookup, admin listing, and webhook behavior |
| Admin Control | Admin can access protected management routes | Admin-only backend routes and dashboard were implemented |
| Testing | Core workflows should be tested before delivery | Manual testing, Postman testing, Vitest tests, and GitHub Actions workflows were added |

---

##  Key Project Outcomes

- The team delivered a functional full-stack MVP.
- The application supports multiple user roles: user, instructor, diving center, and admin.
- The frontend is connected to real backend APIs.
- The backend includes validation, authentication, authorization, and ownership checks.
- Catalog pages display real centers, trips, and courses.
- Users with the user role can create bookings.
- Reviews can be created and filtered by related listing type.
- Payments can be created and managed through the API.
- Admin-only access protects sensitive dashboard and management data.
- Image upload is supported through Multer and Cloudinary when an image is provided.
- Seed data includes test accounts, one approved diving center, one approved trip, and one approved course.
- Backend and frontend automated test workflows were added through GitHub Actions.
- Testing documentation was prepared to record what was tested and how.

---

##  Technical Stack Delivered

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | React + Vite + TypeScript | Build a responsive and interactive user interface |
| Styling | Tailwind CSS | Create consistent styling and layouts |
| Routing | React Router | Manage frontend page navigation |
| Backend | Express + TypeScript | Build REST API endpoints |
| Database | PostgreSQL | Store users, centers, trips, courses, bookings, reviews, and payments |
| ORM | Prisma | Manage database schema and queries |
| Authentication | JWT + bcryptjs | Secure login and password handling |
| Validation | Zod | Validate request bodies, params, and query filters |
| Image Upload | Multer + Cloudinary | Upload and store images for catalog content |
| Payments | Moyasar / Mock Payment Mode | Support payment creation and testing |
| Manual Testing | Postman + Browser Testing | Validate API and user workflows |
| Automated Testing | Vitest + Supertest | Validate backend services, authorization, validation, and frontend logic |
| CI | GitHub Actions | Run backend and frontend test workflows |
| Development | Docker Compose | Run local database services |
| Deployment | Render | Host the frontend and backend services |

---

# Lessons Learned

##  What Went Well

### Clear Feature Separation

The project was organized around major features such as authentication, catalog, bookings, reviews, payments, and dashboards. This made the system easier to understand, test, and explain.

### Strong Backend Structure

The backend was divided into routes, controllers, services, validation files, middleware, and Prisma models. This separation helped keep responsibilities clear and made debugging easier.

### Role-Based Access Control

Using roles helped support different user experiences for divers, instructors, diving centers, and admins. It also improved security by preventing users from accessing routes they should not use.

### Frontend and Backend Integration

The team connected frontend pages to backend APIs, allowing the application to display real data instead of static content. This improved the MVP quality and made the demo more realistic.

### Testing and Documentation

Testing documentation, Postman checks, automated tests, and GitHub Actions helped the team track quality and verify important workflows before delivery.

---

## Challenges and How They Were Addressed

### Challenge 1: Managing Role-Based Logic

The project had several user roles, and each role needed different permissions.

#### Solution

The team added authentication middleware, role middleware, protected frontend routes, and backend authorization checks.

#### Lesson Learned

Role logic should be planned early because it affects routes, database relationships, frontend navigation, and testing.

---

### Challenge 2: Catalog Ownership

Trips and courses could belong to either a diving center or an instructor.

#### Solution

The backend ownership logic was updated so listings can be center-owned or instructor-owned. Update and delete permissions check the correct owner.

#### Lesson Learned

Ownership rules should be clearly defined before implementation to avoid security and data access issues.

---

### Challenge 3: Image Upload Configuration

Image upload required Cloudinary configuration, which can cause issues in local development if environment variables are missing.

#### Solution

The upload flow was handled through upload middleware and Cloudinary configuration checks.

#### Lesson Learned

Third-party service configuration should fail clearly and should be documented for the team.

---

### Challenge 4: Search and Filter Behavior

Search and filters needed to work consistently across catalog pages.

#### Solution

Catalog filters were reviewed and improved, including case handling for trip search and filters.

#### Lesson Learned

Search and filter behavior should be tested with different spelling, casing, and city values.

---

### Challenge 5: Team Coordination

Different team members worked on frontend, backend, testing, and documentation at the same time.

#### Solution

The team used branches, pull requests, review comments, and testing notes to organize the work.

#### Lesson Learned

Clear task ownership and frequent updates reduce confusion and prevent duplicate work.

---

## Recommendations for Future Projects

- Define ownership and role permissions earlier in the planning stage.
- Create shared validation rules before building repeated forms.
- Add more automated tests for critical API routes.
- Add end-to-end tests for the main user journeys.
- Reserve more time for final testing and bug fixing.
- Keep README and testing documentation updated during development, not only at the end.
- Prepare demo data early so the final presentation is smoother.
- Document environment variables clearly for all third-party services.
- Improve production payment readiness.
- Continue improving accessibility and responsive UI quality.

---

#  Team Retrospective

The team conducted a retrospective to reflect on the project experience, evaluate collaboration, and identify improvements for future projects.

## What Worked Well as a Team

- The team successfully delivered a working MVP.
- Team members contributed across frontend, backend, testing, and documentation.
- Pull requests helped track changes and review feedback.
- The team improved the project through multiple review cycles.
- The final MVP demonstrates the main user flows clearly.
- Testing documentation helped organize verification work.
- Automated tests and GitHub Actions improved confidence in the final delivery.

---

## What We Would Do Differently

- Start testing earlier during each feature, not only after implementation.
- Assign ownership more clearly for shared features.
- Add more automated tests for backend APIs.
- Prepare demo accounts and seed data earlier.
- Spend more time polishing UI details before final delivery.
- Keep documentation updated after each major task.
- Create a clearer checklist for environment variables and deployment steps.

---

## Individual Contributions

| Member | Primary Contributions |
|---|---|
| [Lara Alzannan] | Project management, frontend development, UI review, and presentation preparation |
| [Ebtihal Alomari] | Frontend pages, routing, forms, responsive UI, and API integration |
| [Maryam Alessa] | Prisma setup, database models, catalog APIs, and testing documentation |
| [Solaf Alessa] | Authentication, booking, review, payment APIs, image upload, and backend testing |

---

## Overall Team Assessment

The team successfully delivered a functional MVP within the planned project stages.

The project provided practical experience in:

- Full-stack development.
- API design and integration.
- Database modeling.
- Authentication and authorization.
- Frontend and backend collaboration.
- Testing and documentation.
- Deployment preparation.
- Presenting a technical product professionally.

Despite challenges related to permissions, ownership logic, image upload, search behavior, and integration testing, the team resolved issues through review, debugging, and collaboration.

---
