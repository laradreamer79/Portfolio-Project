# Sprint 4 Retrospective

## Project Reflection

### What Went Well

- The application was deployed with working frontend, backend, and database services.
- Moyasar test payments were connected to booking confirmation.
- Automated validation and authorization coverage was expanded.
- Feature-based architecture made the main flows easier to maintain.

### What Could Be Improved

- End-to-end browser automation could provide stronger regression coverage.
- Pull requests should remain small to reduce merge conflicts.
- Testing evidence should be recorded during each sprint instead of at the end.

### Technical Lessons

- Payment and booking updates must remain consistent and idempotent.
- Production migrations should run automatically before deployment.
- Backend authorization remains necessary even when the frontend hides actions.

### Teamwork Lessons

- Clear feature ownership and shared API contracts reduce integration problems.
- Frequent reviews and early integration make conflicts easier to resolve.

## Follow-Up Actions

| Action | Owner | Status |
|---|---|---|
| Add end-to-end browser automation | Team | Future improvement |
| Record evidence during each sprint | Team | Future improvement |
| Continue using small feature pull requests | Team | Ongoing |
