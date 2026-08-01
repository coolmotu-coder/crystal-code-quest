"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { LoginResult } from "@/lib/auth/actions";

export type LoginFormField = {
  name: string;
  label: string;
  type: "email" | "password" | "text";
  inputMode?: React.ComponentProps<"input">["inputMode"];
  autoComplete: string;
  placeholder: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
};

type LoginFormProps = {
  action: (formData: FormData) => Promise<LoginResult>;
  fields: LoginFormField[];
  submitLabel: string;
  roleLabel: string;
};

export function LoginForm({ action, fields, submitLabel, roleLabel }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await action(formData);
    setIsPending(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    // The destination home routes for each role are implemented separately.
    router.push(`/${result.role}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => {
        const inputId = `login-${field.name}`;
        return (
          <div key={field.name} className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
              {field.label}
            </label>
            <input
              id={inputId}
              name={field.name}
              type={field.type}
              inputMode={field.inputMode}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              pattern={field.pattern}
              minLength={field.minLength}
              maxLength={field.maxLength}
              required
              disabled={isPending}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "login-error" : undefined}
              className="block w-full rounded-xl border border-border bg-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:border-teal focus:ring-2 focus:ring-teal disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        );
      })}

      {error ? (
        <p
          id="login-error"
          role="alert"
          aria-live="polite"
          className="bg-danger/10 rounded-lg px-4 py-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="w-full rounded-xl bg-teal px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-teal disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in…" : submitLabel}
      </button>

      <p className="text-center text-xs text-text-muted">{roleLabel}</p>
    </form>
  );
}
