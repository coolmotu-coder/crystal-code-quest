import { loginChild } from "@/lib/auth/actions";
import { PublicShell } from "@/components/auth/public-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function ChildLoginPage() {
  return (
    <PublicShell title="Child Builder sign in" backHref="/login" backLabel="Not you? Go back">
      <LoginForm
        action={loginChild}
        fields={[
          {
            name: "username",
            label: "Username",
            type: "text",
            autoComplete: "username",
            placeholder: "Your builder name",
          },
          {
            name: "pin",
            label: "PIN",
            type: "password",
            inputMode: "numeric",
            autoComplete: "off",
            placeholder: "••••••",
            pattern: "[0-9]{6,}",
            minLength: 6,
            maxLength: 12,
          },
        ]}
        submitLabel="Sign in as Child Builder"
        roleLabel="Enter the username and PIN your parent set up for you."
      />
    </PublicShell>
  );
}
