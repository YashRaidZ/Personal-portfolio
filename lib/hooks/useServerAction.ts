"use client";

import { useState, useTransition, useCallback } from "react";

type ActionResult<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Thin wrapper around useTransition for calling a Server Action (of the
 * `runAction`-wrapped shape from lib/actions/_guard.ts) from a Client
 * Component and getting back pending/error/success state without
 * hand-rolling it on every admin page.
 */
export function useServerAction<Args extends unknown[], T>(
  action: (...args: Args) => Promise<ActionResult<T>>
) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const run = useCallback(
    (...args: Args) => {
      setError(null);
      setSuccess(false);
      startTransition(async () => {
        const result = await action(...args);
        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error);
        }
      });
    },
    [action]
  );

  const reset = useCallback(() => {
    setError(null);
    setSuccess(false);
  }, []);

  return { run, isPending, error, success, reset };
}
