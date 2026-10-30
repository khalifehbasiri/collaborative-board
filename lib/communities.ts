export const communities = [
  { slug: "general", name: "General", description: "The common room. Share ideas, ask questions, and meet the community." },
  { slug: "building", name: "Building", description: "Projects, code, tools, and the lessons learned while making things." },
  { slug: "design", name: "Design", description: "Thoughtful interfaces, creative work, and constructive feedback." },
  { slug: "learning", name: "Learning", description: "Ask a focused question, share a resource, or explain something new." },
] as const;

export type CommunitySlug = (typeof communities)[number]["slug"];

export function findCommunity(slug: string | null | undefined) {
  return communities.find((community) => community.slug === slug);
}
