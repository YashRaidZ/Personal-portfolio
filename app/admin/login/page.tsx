"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";
import { loginAction, type LoginActionState } from "@/lib/actions/auth";

const initialState: LoginActionState = {};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-primary px-4">
      <div className="glass-panel w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-primary/10 text-accent-primary">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <h1 className="font-display text-lg font-semibold text-text-primary">Admin sign in</h1>
            <p className="text-xs text-text-muted">Restricted to authorized admins only</p>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-light">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-text-light">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-bg-elevated/60 px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent-primary/50"
            />
          </div>

          {state.error && (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-2.5 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent-primary px-6 py-2.5 text-sm font-semibold text-bg-primary transition-opacity disabled:opacity-60"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
