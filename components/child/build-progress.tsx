"use client";

import { useEffect, useState } from "react";

const buildStates = ["Preparing", "Building", "Checking", "Reviewing", "Complete"];

const STATE_DURATION_MS = 400;

export function BuildProgress({
  selectionId,
  completeBuild,
}: {
  selectionId: string;
  completeBuild: (formData: FormData) => void | Promise<void>;
}) {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || skipped) {
      setCurrentStateIndex(buildStates.length - 1);
      setIsFinished(true);
      return;
    }

    if (currentStateIndex >= buildStates.length - 1) {
      setIsFinished(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setCurrentStateIndex((index) => index + 1);
    }, STATE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [currentStateIndex, prefersReducedMotion, skipped]);

  function handleSkip() {
    setSkipped(true);
    setCurrentStateIndex(buildStates.length - 1);
    setIsFinished(true);
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <div className="border-warning/30 bg-warning/5 mb-6 rounded-xl border border-dashed p-4">
        <p className="text-sm font-medium text-warning">
          This is a practice build. No real game repository was changed.
        </p>
      </div>

      <ol className="space-y-3" aria-label="Build progress">
        {buildStates.map((state, index) => {
          const isActive = index === currentStateIndex;
          const isDone = index < currentStateIndex;
          const isPending = index > currentStateIndex;

          return (
            <li
              key={state}
              className={`flex items-center gap-3 rounded-xl border border-border p-4 transition ${
                isActive
                  ? "bg-cyan/10 border-cyan/30"
                  : isDone
                    ? "bg-success/5 border-success/30"
                    : isPending
                      ? "bg-elevated opacity-70"
                      : "bg-elevated"
              }`}
              aria-current={isActive ? "step" : undefined}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-cyan text-black"
                    : isDone
                      ? "bg-success text-black"
                      : isPending
                        ? "bg-border text-text-muted"
                        : "bg-border text-text-muted"
                }`}
                aria-hidden="true"
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-cyan" : isDone ? "text-success" : "text-text-muted"
                }`}
              >
                {state}
                {isActive && !isFinished ? "…" : null}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex items-center gap-3">
        {!isFinished && !prefersReducedMotion ? (
          <button
            type="button"
            onClick={handleSkip}
            className="rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-text-secondary transition hover:border-teal hover:text-teal focus-visible:ring-2 focus-visible:ring-teal"
          >
            Skip animation
          </button>
        ) : null}

        {isFinished ? (
          <form action={completeBuild} className="w-full">
            <input type="hidden" name="selectionId" value={selectionId} />
            <button
              type="submit"
              className="w-full rounded-xl bg-cyan px-4 py-3 text-sm font-semibold text-black transition hover:bg-mint focus-visible:ring-2 focus-visible:ring-cyan"
            >
              See the result
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
