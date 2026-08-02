# Oyster

**Saudi Arabia's Diving Platform**

Oyster is a full-stack platform that connects divers with diving centers,
instructors, trips, and courses across Saudi Arabia. This repository documents
the complete project journey from ideation and planning through implementation,
testing, and final delivery.

## Project Links

| Resource | Link |
|---|---|
| Live landing page | [Visit Oyster](https://laradreamer79.github.io/Portfolio-Project/) |
| Demo video | [Watch on YouTube](https://youtu.be/texwZajNdWk) |
| Source repository | [GitHub repository](https://github.com/laradreamer79/Portfolio-Project) |
| Final report | [Stage 5 report](stage5/README.md) |

## Table of Contents

- [Project Links](#project-links)
- [Stage 1: Team Formation and Idea Development](#stage-1-team-formation-and-idea-development)
  - [Main MVP Features](#main-mvp-features)
  - [Challenges Identified](#challenges-identified)
  - [Opportunities](#opportunities)
- [Stage 2: Project Charter Development](#stage-2-project-charter-development)
  - [Objectives](#objectives)
  - [MVP Scope](#mvp-scope)
  - [Risk Assessment](#risk-assessment)
- [Stage 3: Technical Documentation](#stage-3-technical-documentation)
  - [Main Deliverables](#main-deliverables)
  - [Technologies](#technologies)
- [Stage 4: Development and Testing](#stage-4-development-and-testing)
  - [Key Outcomes](#key-outcomes)
  - [Stage 4 Documentation](#stage-4-documentation)
- [Stage 5: Final Delivery and Reflection](#stage-5-final-delivery-and-reflection)
  - [Portfolio Deliverables](#portfolio-deliverables)
  - [Team](#team)

---

## Stage 1: Team Formation and Idea Development

In Stage 1, the team focused on building a collaborative and organized working environment while exploring potential project ideas for the portfolio project.

The team held initial meetings to introduce members, discuss strengths and interests, assign temporary roles, and establish communication and collaboration strategies using tools such as Discord, GitHub Projects, Notion, and Figma.

Several project ideas were brainstormed and evaluated based on:

- Feasibility
- Technical alignment
- Potential impact
- Scalability
- Market need

The team used brainstorming techniques such as Mind Mapping, SCAMPER, and “How Might We” questions to generate and refine ideas.

After evaluating multiple concepts, the team selected **Oyster** as the final MVP idea. Oyster is a digital platform designed to connect users with diving centers, instructors, diving trips, and courses across Saudi Arabia through one unified and user-friendly platform.

### Main MVP Features

- Browse diving centers by city
- View available diving trips and courses
- Send booking requests
- Ratings and reviews system

### Challenges Identified

- Collecting reliable and updated diving center information
- Building partnerships with diving centers
- Delivering a functional MVP within the project timeline

### Opportunities

- Growing marine tourism in Saudi Arabia
- Alignment with Saudi Vision 2030 tourism goals
- Strong scalability for future enhancements

### Team Members

- Lara Mubarak Alzannan
- Maryam Alessa
- Solaf Alessa
- Ebtihal Alomari

---

## Stage 2: Project Charter Development

During Stage 2, the team established a comprehensive Project Charter to define the project's vision, objectives, scope, stakeholders, risks, and high-level execution plan. This stage served as the foundation for aligning team members, clarifying expectations, and ensuring a shared understanding of the project's direction.

The team identified the core purpose of **Oyster**, a platform designed to simplify the discovery and booking of diving experiences across Saudi Arabia while supporting the growth of marine tourism and contributing to the goals of Saudi Vision 2030.

### Objectives

- Create a centralized platform for discovering diving centers, trips, and training courses.
- Reduce the effort and time required to find reliable diving services.
- Enable diving centers to improve their digital presence and receive booking requests through a unified platform.

### Stakeholders

The project involves both internal and external stakeholders, including:

- Project team members
- Diving centers and instructors
- Divers and tourists
- Potential tourism and marine activity partners

### MVP Scope

The Minimum Viable Product (MVP) focuses on delivering the platform's core functionality, including:

- Browsing diving centers by city
- Viewing diving trips and training courses
- User registration and authentication
- Booking request submission
- Ratings and reviews
- Basic administrative content management

### Risk Assessment

Several potential risks were identified during the planning phase, including:

- Limited experience with certain technologies
- Challenges in collecting accurate diving center data
- Project timeline constraints
- User adoption and platform visibility challenges

Mitigation strategies were defined for each identified risk to support successful project delivery.

### High-Level Roadmap

The project roadmap outlines the progression from technical planning and system design to MVP development, testing, refinement, and final delivery.

By completing this stage, the team established a clear project framework and prepared for the technical design and implementation phases that follow.

### Team Members

- Lara Mubarak Alzannan
- Maryam Alessa
- Solaf Alessa
- Ebtihal Alomari

---

## Stage 3: Technical Documentation

During Stage 3, the team focused on translating the project requirements into a detailed technical plan for the Oyster platform. This stage served as the blueprint for the MVP by defining the system architecture, database design, API specifications, development workflow, and testing strategy before implementation.

The team documented the technical structure of the platform, including user stories, UI mockups, architecture diagrams, database models, sequence diagrams, RESTful APIs, source control strategy, and quality assurance plan. These documents ensure that all team members share a common understanding of the system and provide a clear roadmap for the development phase.

### Main Deliverables

- Prioritized User Stories using the MoSCoW method.
- UI mockups illustrating the platform's main screens and user journey.
- High-level System Architecture.
- Components, UML Class Diagram, ER Diagram, and Database Schema.
- Sequence Diagrams for the platform's key user interactions.
- External and Internal API Specifications.
- Source Control Management (SCM) strategy.
- Quality Assurance (QA) strategy.
- Technical Justifications for the selected technologies and architectural decisions.

### Key Features Planned

- Browse diving centers by city.
- View diving center details.
- Browse diving trips and training courses.
- User registration and authentication.
- Online booking requests.
- Secure online payment.
- Ratings and reviews.
- Dashboard for diving centers.
- Admin dashboard for platform management.

### Technologies

- React.js
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Cloudinary
- Calendly
- Moyasar Payment API

### Outcomes

By completing this stage, the team established a complete technical foundation for Oyster before starting development. The documentation provides a clear implementation roadmap, reduces development risks, improves collaboration among team members, and ensures consistency throughout the MVP development process.

### Team Members

- Lara Mubarak Alzannan
- Maryam Alessa
- Solaf Alessa
- Ebtihal Alomari

---

## Stage 4: Development and Testing

During Stage 4, the team implemented and tested the Oyster MVP as a full-stack
application. The frontend was connected to the REST API and database-backed
services, while authentication, authorization, validation, catalog management,
bookings, reviews, payments, image uploads, and role-specific dashboards were
completed.

### Key Outcomes

- Built the frontend with React, TypeScript, Vite, Tailwind CSS, and React Router.
- Built the backend with Express, TypeScript, Prisma, and PostgreSQL.
- Added JWT authentication, password hashing, role-based access, and protected routes.
- Added workflows for divers, instructors, diving centers, and administrators.
- Integrated Cloudinary image uploads and Moyasar payment support.
- Added automated tests, API testing documentation, and GitHub Actions checks.
- Documented the architecture, API, database, deployment, and testing process.

### Stage 4 Documentation

- [Development overview](stage4/README.md)
- [System architecture](stage4/docs/architecture.md)
- [API documentation](stage4/docs/api-docs.md)
- [Testing documentation](stage4/docs/testing/test-plan.md)
- [Production environment](stage4/docs/deployment/production-environment.md)

---

## Stage 5: Final Delivery and Reflection

Stage 5 closes the project with the final results, lessons learned, team
retrospective, presentation materials, demo, and a standalone portfolio landing
page. The complete reflection and feature evaluation are documented in the
[Stage 5 final report](stage5/README.md).

### Portfolio Deliverables

| Deliverable | Link |
|---|---|
| Live Oyster landing page | [Open landing page](https://laradreamer79.github.io/Portfolio-Project/) |
| Oyster demo video | [Watch on YouTube](https://youtu.be/texwZajNdWk) |
| Final project report | [Read the Stage 5 report](stage5/README.md) |
| Project repository | [View source on GitHub](https://github.com/laradreamer79/Portfolio-Project) |

### Team

| Team Member | Role | GitHub |
|---|---|---|
| Lara Alzannan | Project Manager / Frontend Developer | [laradreamer79](https://github.com/laradreamer79) |
| Ebtihal Alomari | Frontend Developer | [bakosh2](https://github.com/bakosh2) |
| Maryam Alessa | Backend Developer | [maryam13188](https://github.com/maryam13188) |
| Solaf Alessa | Backend Developer | [lilsouy](https://github.com/lilsouy) |
