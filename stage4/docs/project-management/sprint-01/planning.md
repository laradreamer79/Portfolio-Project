# Sprint 1 Planning

## Sprint Details

- Status: Completed
- Start date: [Add date]
- End date: [Add date]
- Sprint goal: Establish the project foundation and source-control workflow, configure the frontend and backend, and build the main frontend UI pages.

## Planned Work

| Owner | Task | Branch | Acceptance Criteria |
|---|---|---|---|
| Team | Create the GitHub repository and upload the initial project | Initial setup | All members can access and clone the repository |
| Team | Configure the Git workflow | Initial setup | `main`, `develop`, feature branches, Issues, and Pull Requests are used consistently |
| Team | Organize the Stage 4 project structure | Initial setup | Frontend, backend, database, documentation, and asset folders are clearly separated |
| Frontend Owner | Configure React with Vite | Frontend setup | React development server starts successfully |
| Frontend Owner | Configure Tailwind CSS, React Router, and linting | Frontend setup | Styling, navigation, build, and lint commands work |
| Backend Owner | Initialize the Node.js and Express backend | Backend setup | Backend dependencies install and the initial server starts successfully |
| Backend Owner | Prepare the initial backend folder and npm configuration | Backend setup | Backend project structure and scripts are available for later API work |
| Project Manager / Frontend Owner | Import and clean the Figma UI | `feature/frontend-ui-pages` | Required pages render without unused generated UI files |
| Project Manager / Frontend Owner | Convert frontend to TypeScript | `feature/frontend-ui-pages` | Typecheck and production build pass |
| Project Manager / Frontend Owner | Add routing and page navigation | `feature/frontend-ui-pages` | All documented frontend routes open correctly |
| Project Manager / Frontend Owner | Create reusable layout and card components | `feature/frontend-ui-pages` | Shared UI is reused across relevant pages |
| Team | Review and merge frontend UI | Pull Request | Review completed and merged into `develop` |

## Dependencies and Risks

- Team members required GitHub access and a consistent branching workflow.
- Frontend and backend Node.js dependencies had to be installed consistently.
- Backend work in Sprint 1 was limited to initial setup; database and authentication features were planned for Sprint 2.
- Figma output contained generated files and dependencies that required cleanup.
- Frontend folder-name casing had to remain consistent across macOS and Git.
- UI pages used mock data because APIs were not part of Sprint 1.

## Definition of Done

- The project is available to all members through GitHub.
- The repository, folder structure, and branching workflow are established.
- React and Express development servers start successfully.
- Frontend TypeScript, Tailwind CSS, routing, build, and lint configuration work.
- Main frontend pages are implemented.
- Routing works.
- Reusable components replace repeated UI.
- Typecheck, build, and lint pass.
- Pull Request is reviewed and merged into `develop`.
