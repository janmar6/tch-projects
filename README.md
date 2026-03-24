# Projects + Blog site (Astro + PocketBase)

This project is a personal portfolio/blog setup designed for self-hosting.

## Stack

- Astro frontend (server output)
- PocketBase backend (SQLite + file uploads)
- Podman Compose for deployment

## Run with podman-compose

1. Copy env values:

```bash
 cp .env.example .env
```

2. Start services:

```bash
 podman-compose up -d --build
```

3. Open:
- Frontend: [http://localhost:4321](http://localhost:4321)
- PocketBase admin: [http://localhost:8090/_/](http://localhost:8090/_/)

## PocketBase collections

Create these collections in PocketBase:

- `posts`: `title`, `slug`, `excerpt`, `content`, `coverImage(file)`, `published(bool)`, `publishedAt(date)`
- `projects`: `name`, `slug`, `summary`, `description`, `images(file[])`, `repoUrl(url)`, `liveUrl(url)`, `featured(bool)`

Set list/view API rules so published content is readable from the frontend.

## Notes

- Uploaded files are persisted in `pocketbase/pb_data`.
- Frontend reads backend using `POCKETBASE_URL` (internal) and `PUBLIC_POCKETBASE_URL` (browser-facing URLs).
