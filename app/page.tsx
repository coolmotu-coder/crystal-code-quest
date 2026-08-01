import { PublicShell } from "@/components/auth/public-shell";
import { RoleChoice } from "@/components/auth/role-choice";

export default function HomePage() {
  return (
    <PublicShell title="Welcome" subtitle="Turn imagination into real game features.">
      <RoleChoice />
    </PublicShell>
  );
}
