"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Mail, MailOpen } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { useServerAction } from "@/lib/hooks/useServerAction";
import { markMessageReadAction, deleteMessageAction } from "@/lib/actions/contact-messages";
import type { ContactMessageRow } from "@/lib/queries/contact-messages";

export function MessagesInbox({
  initialMessages,
  initialSearch,
  initialUnreadOnly,
}: {
  initialMessages: ContactMessageRow[];
  initialSearch: string;
  initialUnreadOnly: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [unreadOnly, setUnreadOnly] = useState(initialUnreadOnly);
  const { run: runMarkRead } = useServerAction(markMessageReadAction);
  const { run: runDelete } = useServerAction(deleteMessageAction);

  function applyFilters(nextSearch: string, nextUnreadOnly: boolean) {
    const params = new URLSearchParams();
    if (nextSearch) params.set("q", nextSearch);
    if (nextUnreadOnly) params.set("unread", "1");
    router.push(`/admin/messages${params.toString() ? `?${params.toString()}` : ""}`);
  }

  useEffect(() => {
    const timeout = setTimeout(() => applyFilters(search, unreadOnly), 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, unreadOnly]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, or message…"
            className="w-full rounded-lg border border-white/10 bg-bg-elevated/60 py-2.5 pl-9 pr-4 text-sm text-text-primary outline-none focus:border-accent-primary/50"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-text-light">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
          Unread only
        </label>
      </div>

      {initialMessages.length === 0 ? (
        <p className="text-sm text-text-muted">No messages match.</p>
      ) : (
        <div className="space-y-3">
          {initialMessages.map((m) => (
            <div key={m.id} className={`glass-panel px-5 py-4 ${!m.isRead ? "border-accent-primary/30" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary">{m.name}</p>
                    {!m.isRead && <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />}
                  </div>
                  <a href={`mailto:${m.email}`} className="text-xs text-accent-secondary hover:underline">
                    {m.email}
                  </a>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-text-light">{m.message}</p>
                  <p className="mt-2 text-xs text-text-muted">{new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => {
                      runMarkRead(m.id, !m.isRead);
                      router.refresh();
                    }}
                    className="rounded-md border border-white/10 p-1.5 text-text-muted transition-colors hover:border-accent-primary/40 hover:text-accent-primary"
                    aria-label={m.isRead ? "Mark unread" : "Mark read"}
                  >
                    {m.isRead ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                  </button>
                  <ConfirmDeleteButton
                    onConfirm={() => {
                      runDelete(m.id);
                      router.refresh();
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
