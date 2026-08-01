import { DashboardNav } from "./nav";

export type DashboardShellProps = {
  userRole: "child" | "parent";
  currentPath: string;
  userName: string;
  streakDays?: number | undefined;
  childName?: string | undefined;
  childLevel?: number | undefined;
  children: React.ReactNode;
};

export function DashboardShell({
  userRole,
  currentPath,
  userName,
  streakDays,
  childName,
  childLevel,
  children,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNav
        userRole={userRole}
        currentPath={currentPath}
        userName={userName}
        streakDays={streakDays}
        childName={childName}
        childLevel={childLevel}
      />
      <div className="pt-14 md:pl-64">
        <main
          className="min-h-[calc(100vh-3.5rem)] px-4 pb-24 pt-6 md:px-6 md:pb-8 lg:px-8"
          aria-label={userRole === "parent" ? "Parent dashboard" : "Child dashboard"}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
