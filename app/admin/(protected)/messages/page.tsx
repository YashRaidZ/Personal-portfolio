import { getContactMessages } from "@/lib/queries/contact-messages";
import { MessagesInbox } from "./MessagesInbox";

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; unread?: string }>;
}) {
  const params = await searchParams;
  const messages = await getContactMessages({
    search: params.q,
    unreadOnly: params.unread === "1",
  });

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-text-primary">Messages</h1>
      <p className="mt-1 text-sm text-text-muted">Submissions from the public contact form.</p>
      <div className="mt-8">
        <MessagesInbox initialMessages={messages} initialSearch={params.q ?? ""} initialUnreadOnly={params.unread === "1"} />
      </div>
    </div>
  );
}
