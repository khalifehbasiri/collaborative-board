import { Navigation } from "../../components/Navigation";
import { PostDetail } from "../../components/PostDetail";

export const metadata = {
  title: "Discussion",
  description: "Read the discussion and join the conversation on Collab Board.",
};

export default async function Discussion({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="mx-auto max-w-3xl space-y-5 px-3 py-6 sm:px-6">
        <PostDetail postId={postId} />
      </main>
    </div>
  );
}
