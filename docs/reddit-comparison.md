# Reddit comparison and implementation plan

Research date: October 30, 2026.

Collab Board already supports public reading, Clerk sign-in, post types, post voting,
author deletion, a live feed, client-side search, and flat comments. Reddit's useful
distinctions are how it organizes, discovers, and sustains conversations.

| Capability | Starting point | This release |
| --- | --- | --- |
| Topic communities | One shared board; post types act as filters | Curated communities with descriptions, membership, scoped feeds, and community selection when posting |
| Discovery | Newest/oldest and client-side vote sorting | Indexed, paginated New, Hot, and Top feeds; server-side full-text search |
| Discussion | Flat comments in a modal | Paginated reply threads, collapse/expand, preserved replies after author deletion |
| Return visits | No saved collection | Private, account-backed saved posts and a Saved feed |
| Sharing | Dashboard URL only | Stable discussion URLs with the original post and its replies |
| Post structure | Body only | Descriptive titles with backward-compatible rendering of existing posts |
| Reliability | Unbounded feed reads and console-only mutation errors | Bounded reads, server validation, visible errors, and authenticated backend integration tests |

Hot is our transparent ranking, not a claim to reproduce Reddit's proprietary
recommendations: signed log vote score plus creation time divided by 45,000 seconds.
Top orders by net votes; New orders by creation time. Search uses Convex relevance.

Sources:

- [Reddit search scope](https://support.reddithelp.com/hc/en-us/articles/19695647891988-How-does-Reddit-search-work)
- [Search filters and sorts](https://support.reddithelp.com/hc/en-us/articles/19695706914196-What-filters-and-sorts-are-available)
- [Communities and their settings](https://support.reddithelp.com/hc/en-us/articles/15484546290068-Community-settings)
- [Titles, posts, comments, and replies](https://support.reddithelp.com/hc/en-us/articles/360060422572-How-do-I-post-and-comment-on-Reddit)
- [Saved posts](https://support.reddithelp.com/hc/en-us/articles/205243605-How-do-I-save-a-post-and-where-does-it-get-saved)

This release focuses on the community discussion loop. Reddit also has moderator
teams/queues, reputation systems, media hosting, chat, notifications, and algorithmic
personalization. Those require separate product and operational decisions and are
outside this release. Community membership here organizes navigation; all
communities remain public. There is no claim that membership restricts access.

Delivery: commit research, backend, interface, and verification separately; test on
the development backend; deploy the compatible schema and migrate existing records
in batches before releasing the frontend; verify the live production domain.
