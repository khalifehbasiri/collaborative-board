# Collab Board

Collab Board is a real-time community platform where people can share suggestions, ask questions, start discussions, comment, and vote.

I built this project to demonstrate how I approach product development from end to end: understand the user flow, choose tools that fit the problem, protect data at the server boundary, refine the interface, and ship a maintainable result.

## Why I built it

I wanted to build more than a basic CRUD application. A collaborative board introduces the kinds of details that make product work interesting: live data, authentication, ownership rules, relationships between users and content, vote state, responsive behavior, and clear feedback in the UI.

This project reflects the kind of work I enjoy—turning an idea into a usable product, working through edge cases, and improving both the experience and the code behind it.

## What the project demonstrates

- **Product thinking:** the experience is organized around a simple flow—discover the community, sign in, create a post, join a discussion, and vote.
- **Full-stack ownership:** the interface, data model, authentication flow, server functions, and deployment configuration live in one cohesive project.
- **Real-time application design:** Convex keeps posts, comments, and votes synchronized without manual refresh logic.
- **Authorization at the data layer:** protected mutations verify the signed-in user, and only authors can delete their own posts or comments.
- **Intentional data modeling:** users, posts, comments, and votes are separate related entities with indexes for the access patterns the application needs.
- **Responsive UI work:** the landing page and community dashboard are designed for desktop and mobile layouts.
- **Delivery discipline:** linting, production builds, environment configuration, and Vercel deployment are part of the workflow rather than afterthoughts.

## Core features

- Real-time community feed
- Suggestion, question, and topic post types
- Clerk-powered authentication
- Post and comment creation for signed-in members
- Upvotes and downvotes with one active vote per member and post
- Author-only deletion for posts and comments
- Newest and oldest sorting, plus post-type filtering
- Responsive landing page, dashboard, navigation, and theme support

## Technical decisions

| Decision | Why I chose it |
| --- | --- |
| **Next.js App Router** | Provides a clear route and layout structure while supporting a modern React architecture. |
| **Convex** | Fits a collaborative product well because queries update reactively and backend functions stay close to the TypeScript data model. |
| **Clerk** | Handles the identity flow so I could focus on application behavior while still enforcing authorization inside Convex mutations. |
| **Separate vote records** | Preserves each member's vote state and makes toggling or switching between upvotes and downvotes predictable. |
| **Server-side ownership checks** | UI controls are helpful, but permissions must be enforced where data is changed. |
| **Tailwind CSS** | Makes it practical to iterate quickly on layout, responsive behavior, and a consistent visual system. |

## How I worked

My workflow for this project followed small, testable vertical slices:

1. Defined the main user journey and the minimum useful feature set.
2. Modeled users, posts, comments, and votes before building interactions around them.
3. Connected Clerk identity to Convex users and added authorization to every protected mutation.
4. Built complete flows—create, read, vote, comment, and delete—then handled ownership and empty states.
5. Refined the responsive interface and separated reusable UI into focused components.
6. Ran lint and production-build checks, documented setup, and configured deployment for Vercel.

I prefer this approach because it keeps progress visible, catches integration problems early, and produces working software throughout development—not only at the end.

## Architecture

```text
Next.js UI
    |
    | Clerk session
    v
Convex queries and mutations
    |
    +-- users
    +-- posts
    +-- comments
    +-- votes
```

The React interface subscribes to Convex queries for live data. Mutations resolve the current Clerk identity to an application user before allowing protected changes. Relationships and indexes keep authorship, comments, and vote lookups explicit.

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Convex
- Clerk
- Lucide React
- Bun
- Vercel

## Run locally

### Prerequisites

- [Bun](https://bun.sh)
- A [Clerk](https://clerk.com) application
- A [Convex](https://www.convex.dev) project

Install dependencies:

```bash
bun install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=
CLERK_JWT_ISSUER_DOMAIN=
```

Configure Clerk's Convex JWT template and expose its issuer domain to the Convex deployment as `CLERK_JWT_ISSUER_DOMAIN`.

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
bun run lint
bun run build
```

## What I would build next

- Real-time presence backed by live session data
- Search, pagination, and richer feed ranking
- Notification preferences and activity history
- Automated tests for permissions and voting behavior
- Accessibility audits and broader keyboard-navigation coverage

These are intentionally listed as next steps rather than hidden gaps. I value being clear about what is complete, what can improve, and how I would evolve a product after its first release.

## Deployment

The project is configured for Vercel. Add the Clerk and Convex environment variables to the Vercel project, then connect the repository for deployments from Git.
