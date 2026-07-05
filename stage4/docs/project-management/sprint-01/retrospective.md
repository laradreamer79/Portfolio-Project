# Sprint 1 Retrospective

## What Went Well

- The main UI was completed early enough to define later API requirements.
- TypeScript improved component and routing safety.
- Shared components reduced duplicated page markup.
- Pull Request review identified integration and folder-casing problems before release.

## What Did Not Go Well

- Figma generated unnecessary files and dependencies.
- The initial frontend branch was behind `develop`, which caused merge conflicts.
- Authentication screens initially looked functional but still used mock state.

## Lessons Learned

- Update a feature branch from `develop` before opening or merging a Pull Request.
- Generated code should be reviewed before it is committed.
- UI completion and feature completion are different: a page is not complete until its real API flow works.

## Improvement Actions

| Action | Owner | Due Sprint | Status |
|---|---|---|---|
| Require build and lint evidence in every frontend PR | Project Manager | Sprint 2 | In Progress |
| Define API response contracts before integration | Frontend and Backend owners | Sprint 2 | In Progress |
| Require one approving review before merge | Team | Sprint 2 | In Progress |

