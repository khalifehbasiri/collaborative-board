# Production release

Frontend: [Collab Board](https://collaborative-board-psi.vercel.app).
Vercel project: `collaborative-board`. Production Git branch: `main`.
Production Convex endpoint: `https://careful-ladybug-789.convex.cloud`.
Development Convex deployment: `steady-rook-650`.

Keep `.env*`, `.clerk/`, and `.vercel/` untracked. Never copy development deployment
URLs into production. New schema fields are optional so the old frontend stays
compatible while the backend is released.

## Validate

```sh
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build
```

## Backend first

Verify the production endpoint printed by the dry run matches Vercel's configured
`NEXT_PUBLIC_CONVEX_URL` before changing the backend:

```sh
bunx convex deploy --dry-run --yes
bunx convex deploy --yes
bunx convex run migrations:communityRelease --prod
```

The internal migration runs in batches, puts existing posts in General, populates
search and ranking fields, and counts existing comments. Wait for its scheduled
work to finish before releasing the frontend. Re-running it skips migrated posts.
It preserves post IDs, authors, content, votes, and existing comment relationships.

## Frontend

Push the tested commits to `origin/main`. Check Vercel for a READY production
deployment matching that commit. If Git integration does not start a build,
deploy the clean checkout with the authenticated Vercel CLI:

```sh
bunx vercel deploy --prod --yes
```

Verify the stable production domain, not just the generated deployment hostname:
community switching, Hot/New/Top, search, load more, a discussion permalink,
signed-out states, and mobile layout. Authenticated backend integration tests cover
membership, save privacy, voting, input limits, ownership, reply depth, and cleanup.
Browser authentication still needs a real Clerk session for a full signed-in UI check.

## Recovery

If frontend checks fail, promote the previous READY production deployment in
Vercel. Leave the additive backend schema in place: the previous frontend still
uses the compatible `posts.list` and `comments.list` functions. Do not remove new
tables or import an old database snapshot just to roll back the interface.
