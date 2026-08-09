# Collab Board

A real-time community discussion board for sharing suggestions, questions, and topics. Signed-in members can post, comment, vote, and manage their own content.

## Stack

- Next.js 16 and React 19
- TypeScript and Tailwind CSS
- Convex for real-time data and server functions
- Clerk for authentication
- Bun for local development and builds

## Features

- Live community feed with suggestion, question, and topic posts
- Authenticated post and comment creation
- Upvote and downvote support, with one vote per member per post
- Author-only deletion for posts and comments
- Responsive landing page and community dashboard

## Run locally

### Prerequisites

- [Bun](https://bun.sh)
- A [Clerk](https://clerk.com) application
- A [Convex](https://www.convex.dev) project

Install dependencies and start the app:

```bash
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Create `.env.local` with the values for your Clerk and Convex projects:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=
CLERK_JWT_ISSUER_DOMAIN=
```

Configure Clerk's Convex JWT template and make sure its issuer domain is available to the Convex deployment as `CLERK_JWT_ISSUER_DOMAIN`.

## Quality checks

```bash
bun run lint
bun run build
```

## Deployment

This project is configured for Vercel. Pushes to the connected Git branch trigger a deployment. Add the same Clerk and Convex environment variables in the Vercel project settings before deploying.
