# Docker Development Setup

Docker Compose runs the local PostgreSQL database. The React frontend and
Express backend continue to run directly with npm during development.

## Requirements

- Docker Desktop
- Docker Compose

## Optional Configuration

The Compose file includes development defaults. To override them:

```bash
cd stage4
cp .env.docker.example .env
```

The `.env` file is ignored by Git. Do not use these development credentials in
production.

## Start PostgreSQL

```bash
cd stage4
docker compose up -d db
docker compose ps
```

Wait until the `db` service reports `healthy`.

## Backend Connection

When the Express backend runs on the host machine, use:

```env
DATABASE_URL="postgresql://oyster:oyster_dev_password@localhost:5432/oyster?schema=public"
```

If the Docker development values are changed, update `DATABASE_URL` to match.

## Inspect PostgreSQL

Open the PostgreSQL command line:

```bash
docker compose exec db psql -U oyster -d oyster
```

Useful commands:

```sql
\dt
\l
\q
```

View database logs:

```bash
docker compose logs -f db
```

## Stop PostgreSQL

Stop the container while preserving the database:

```bash
docker compose stop db
```

Stop and remove the container while preserving the named volume:

```bash
docker compose down
```

Delete the container and all local database data:

```bash
docker compose down -v
```

`docker compose down -v` is destructive. Use it only when intentionally
resetting the local development database.
