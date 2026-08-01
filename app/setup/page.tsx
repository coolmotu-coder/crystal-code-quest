import { notFound } from "next/navigation";
import { setupParent } from "@/lib/auth/actions";
import { PublicShell } from "@/components/auth/public-shell";
import { LoginForm } from "@/components/auth/login-form";
import { countUsers } from "@/lib/db/queries";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (countUsers() > 0) {
    notFound();
  }

  return (
    <PublicShell
      title="First-time setup"
      subtitle="Create the trusted Parent account for this device."
    >
      <LoginForm
        action={setupParent}
        fields={[
          {
            name: "email",
            label: "Parent email",
            type: "email",
            autoComplete: "email",
            placeholder: "parent@example.com",
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            placeholder: "A strong password",
          },
        ]}
        submitLabel="Create Parent account"
        roleLabel="This device is for a single family. Only the first person can create the Parent account."
      />
    </PublicShell>
  );
}
