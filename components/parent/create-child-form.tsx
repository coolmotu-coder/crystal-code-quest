"use client";

import { useState } from "react";
import type { CreateChildResult } from "@/lib/auth/actions";

type CreateChildFormProps = {
  createChild: (formData: FormData) => Promise<CreateChildResult>;
};

export function CreateChildForm({ createChild }: CreateChildFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setSuccess(null);
    setIsPending(true);

    const formData = new FormData(form);
    const result: CreateChildResult = await createChild(formData);
    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setSuccess(`Child Builder account created for ${result.username}.`);
    form.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="create-child-display-name"
          className="block text-sm font-medium text-text-secondary"
        >
          Display name
        </label>
        <input
          id="create-child-display-name"
          name="displayName"
          type="text"
          autoComplete="off"
          placeholder="Linus"
          required
          disabled={isPending}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "create-child-error" : undefined}
          className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-teal focus:ring-2 focus:ring-teal disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="create-child-username"
          className="block text-sm font-medium text-text-secondary"
        >
          Username
        </label>
        <input
          id="create-child-username"
          name="username"
          type="text"
          autoComplete="off"
          placeholder="linus-builder"
          required
          disabled={isPending}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "create-child-error" : undefined}
          className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-teal focus:ring-2 focus:ring-teal disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="create-child-pin" className="block text-sm font-medium text-text-secondary">
          PIN
        </label>
        <input
          id="create-child-pin"
          name="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          placeholder="••••••"
          pattern="[0-9]{6,}"
          minLength={6}
          maxLength={12}
          required
          disabled={isPending}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? "create-child-error" : undefined}
          className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-teal focus:ring-2 focus:ring-teal disabled:cursor-not-allowed disabled:opacity-60"
        />
        <p className="text-xs text-text-muted">
          Choose a PIN with at least six digits for signing in.
        </p>
      </div>

      {error ? (
        <p
          id="create-child-error"
          role="alert"
          aria-live="polite"
          className="bg-danger/10 rounded-lg px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      {success ? (
        <p
          className="bg-success/10 rounded-lg px-4 py-3 text-sm text-success"
          role="status"
          aria-live="polite"
        >
          {success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Creating account…" : "Create Child Builder account"}
      </button>
    </form>
  );
}
