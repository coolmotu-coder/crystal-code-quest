import Link from "next/link";
import { loginParent } from "@/lib/auth/actions";
import { PublicShell } from "@/components/auth/public-shell";
import { LoginForm } from "@/components/auth/login-form";
import { countUsers } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function ParentLoginPage() {
  const isFreshInstall = countUsers() === 0;

  return (
    <PublicShell
      title="Parent sign in"
      backHref="/login"
      backLabel="Not a parent? Go back"
      extraFooter={
        isFreshInstall ? (
          <>
            First time?{" "}
            <Link
              href="/setup"
              className="text-teal underline decoration-transparent underline-offset-4 transition hover:decoration-teal focus-visible:rounded"
            >
              Set up this device
            </Link>
          </>
        ) : null
      }
    >
      <LoginForm
        action={loginParent}
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            autoComplete: "email",
            placeholder: "parent@example.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "current-password",
            placeholder: "Your password",
          },
        ]}
        submitLabel="Sign in as Parent"
        roleLabel="This is the trusted supervisory account."
      />
    </PublicShell>
  );
}
