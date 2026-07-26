# Sprint 2 Planning

## Sprint Details

- Status: Completed
- Sprint goal: Configure the database and complete Register, Login, Logout, and role-based authentication.

## Team Responsibilities

| Owner | Task | Branch | Acceptance Criteria |
|---|---|---|---|
| Project Manager | Manage issues, review PRs, maintain evidence, and verify integration | Management branches | Sprint documents and review evidence stay current |
| Project Manager | Refactor Express backend structure to TypeScript | `chore/backend-structure` | Backend builds, starts, and health endpoint returns `200` |
| Database Owner | Configure Prisma, PostgreSQL, User model, migration, and repeatable development seeds | `feature/database-user-model` | Migration and seed succeed; four roles are supported |
| Backend Auth Owner | Implement Register, Login, bcrypt, JWT, and authorization middleware | `feature/backend-auth` | Auth API tests and Postman checks pass |
| Frontend Integration Owner | Connect auth UI, AuthContext, protected routes, logout, and role redirects | `feature/frontend-auth` | Real API flow works for all roles |

## Role Contract

| Stored role | UI label | Redirect |
|---|---|---|
| `user` | Diver / User | `/dashboard` |
| `instructor` | Instructor | `/dashboard` |
| `diving_center` | Diving Center | `/center/dashboard` |
| `admin` | Admin | `/admin` |

## API Contract

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "role": "user"
  }
}
```

## Dependencies

- Backend Authentication depends on the merged Prisma User model.
- Frontend Authentication can begin against the agreed API contract.
- Full integration testing begins after both authentication PRs are available.

## Definition of Done

- PostgreSQL migration and repeatable seed pass.
- Register and Login APIs work.
- Passwords are hashed and never returned.
- JWT authentication and role authorization work.
- Frontend authentication uses the real API.
- Protected routes and role redirects work.
- Postman and automated tests pass.
- Documentation and evidence are updated.
