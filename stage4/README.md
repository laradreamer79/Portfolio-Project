# Oyster — Stage 4

Oyster is a full-stack platform for discovering diving centers, trips, and
courses in Saudi Arabia. It supports customer bookings and reviews, online
payment integration, and role-specific dashboards for customers, instructors,
diving centers, and administrators.

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma ORM |
| Authentication | JWT with role-based authorization |
| Media | Cloudinary |
| Payment | Moyasar integration with a configurable mock mode |
| Deployment | Render |

For local setup, development commands, test accounts, database commands, and
the team workflow, see the [Team How-To Guide](docs/team-how-to-guide.md).

## Sprint Planning

Each sprint has a planning document containing its goal, planned work,
ownership, acceptance criteria, dependencies, risks, and Definition of Done.

| Sprint | Goal | Planning |
|---|---|---|
| Sprint 1 | Establish the project structure and build the frontend foundation | [Sprint 1 planning](docs/project-management/sprint-01/planning.md) |
| Sprint 2 | Implement PostgreSQL, Prisma, authentication, and role foundations | [Sprint 2 planning](docs/project-management/sprint-02/planning.md) |
| Sprint 3 | Integrate core APIs, catalog, booking, reviews, and dashboards | [Sprint 3 planning](docs/project-management/sprint-03/planning.md) |
| Sprint 4 | Complete payment, testing, deployment, and release preparation | [Sprint 4 planning](docs/project-management/sprint-04/planning.md) |

## Sprint Reviews

Sprint reviews record the completed work, demonstrated flows, testing evidence,
deferred work, and stakeholder feedback.

- [Sprint 1 review](docs/project-management/sprint-01/review.md)
- [Sprint 2 review](docs/project-management/sprint-02/review.md)
- [Sprint 3 review](docs/project-management/sprint-03/review.md)
- [Sprint 4 review](docs/project-management/sprint-04/review.md)

## Retrospectives

The retrospectives document what went well, what did not go well, lessons
learned, and improvement actions for the following sprint.

- [Sprint 1 retrospective](docs/project-management/sprint-01/retrospective.md)
- [Sprint 2 retrospective](docs/project-management/sprint-02/retrospective.md)
- [Sprint 3 retrospective](docs/project-management/sprint-03/retrospective.md)
- [Sprint 4 retrospective](docs/project-management/sprint-04/retrospective.md)

## Source Repository

- Repository: [laradreamer79/Portfolio-Project](https://github.com/laradreamer79/Portfolio-Project)
- Integration branch: `develop`
- Pull requests: [GitHub Pull Requests](https://github.com/laradreamer79/Portfolio-Project/pulls)
- Commit history: [GitHub commits](https://github.com/laradreamer79/Portfolio-Project/commits/develop)
- Workflow details: [Source repository and workflow](docs/project-management/source-repository.md)

Development is completed on short-lived `feature/*`, `fix/*`, `refactor/*`,
`test/*`, or `docs/*` branches. Pull requests target `develop` and require
review plus the relevant automated checks before merge.

## Bug Tracking

- Tracker: [GitHub Issues](https://github.com/laradreamer79/Portfolio-Project/issues)
- Process and severity definitions: [Bug tracking process](docs/project-management/bug-tracking.md)

Bugs should include reproducible steps, expected and actual behavior,
environment details, severity, and evidence. Fixes are linked to their GitHub
Issue through the related pull request.

## Testing Evidence and Results

The project uses TypeScript, Oxlint, Vitest, Supertest, manual browser checks,
Postman, and production smoke testing.

Current automated baseline:

| Project | Check | Result |
|---|---|---|
| Frontend | Vitest | 51 tests passed |
| Frontend | TypeScript and Vite production build | Passed |
| Frontend | Oxlint | Passed |
| Backend | Vitest and Supertest | 67 tests passed |
| Backend | Prisma Client generation and TypeScript build | Passed |

Testing documentation:

- [Stage 4 test plan](docs/testing/test-plan.md)
- [Sprint 1 test results](docs/testing/sprint-01-results.md)
- [Sprint 2 test results](docs/testing/sprint-02-results.md)
- [Sprint 3 test results](docs/testing/sprint-03-results.md)
- [Sprint 4 test results](docs/testing/sprint-04-results.md)
- [Testing evidence index](docs/testing/evidence/README.md)
- [Sprint 1 evidence](docs/testing/evidence/sprint-01/README.md)
- [Sprint 2 evidence](docs/testing/evidence/sprint-02/README.md)
- [Sprint 3 evidence](docs/testing/evidence/sprint-03/README.md)
- [Sprint 4 evidence](docs/testing/evidence/sprint-04/README.md)
- [Postman collection guide](docs/testing/postman/README.md)
- [GitHub Actions runs](https://github.com/laradreamer79/Portfolio-Project/actions)

Run the automated checks locally:

```bash
cd stage4/frontend
npm test
npm run lint
npm run build

cd ../backend
npm test
npm run build
```

## Production Environment

| Component | Provider | Address |
|---|---|---|
| Frontend | Render | [zeroyster.onrender.com](https://zeroyster.onrender.com) |
| Backend API | Render | [Oyster API health](https://oyster-kwn3.onrender.com/api/health) |
| PostgreSQL | Render | Private production database |

Deployments use the `develop` integration branch. The backend build must run
`npx prisma migrate deploy` so committed Prisma migrations are applied before
the new application version starts. Production credentials and connection
strings are stored as Render environment variables and are never committed.

See [Production environment](docs/deployment/production-environment.md) for
build commands, required environment-variable names, verification steps, and
rollback guidance.

## Project Structure

```text
stage4/
├── frontend/                React application
├── backend/                 Express API and Prisma schema
├── docs/
│   ├── project-management/  Sprint and repository documentation
│   ├── testing/             Test plans, results, and evidence
│   └── deployment/          Production environment documentation
└── assets/                  Documentation images
```

<div align="center">

<table>
  <tr>
    <td align="center" width="50%">
      <h3>Frontend Structure</h3>
      <img width="480" alt="Oyster Frontend Project Structure" src="assets/frontend-structure.png" />
    </td>
    <td align="center" width="50%">
      <h3>Backend Structure</h3>
      <img width="480" alt="Oyster Backend Project Structure" src="assets/backend-structure.png" />
    </td>
  </tr>
</table>

</div>
