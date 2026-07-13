# Source Repository and Workflow

## Repository

- Repository URL: [Add GitHub repository URL]
- Primary integration branch: `develop`
- Production branch: `main`

## Branching Strategy

| Branch type | Pattern | Purpose |
|---|---|---|
| Feature | `feature/<name>` | New product functionality |
| Fix | `fix/<name>` | Bug fixes |
| Documentation | `docs/<name>` | Documentation changes |
| Maintenance | `chore/<name>` | Tooling and project structure |

Every branch must start from the latest `develop`:

```bash
git switch develop
git pull origin develop
git switch -c feature/task-name
```

## Pull Request Rules

1. Pull Requests target `develop`, not `main`.
2. The author links the related GitHub Issue.
3. The author provides a summary and testing evidence.
4. At least one team member reviews the changes.
5. Build, typecheck, lint, and relevant tests must pass.
6. Unresolved review comments block the merge.
7. The feature branch may be deleted after merging.

## Commit Convention

Examples:

```text
feat(frontend): connect login form
feat(backend): add registration endpoint
fix(auth): reject expired token
docs(stage4): add sprint review
test(api): add authentication tests
chore(database): configure Prisma
```

## Important Pull Requests

| Pull Request | Scope | Sprint | Status |
|---|---|---|---|
| [Add link] | Frontend UI pages | Sprint 1 | Merged |
| [Add link] | Express TypeScript structure | Sprint 2 | Merged |
| [Add link] | Prisma and User model | Sprint 2 | In Review |
