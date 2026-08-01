import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { ChildAvatar, ParentAvatar } from "./avatar";

export type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  planned?: boolean;
};

export type DashboardNavProps = {
  userRole: "child" | "parent";
  currentPath: string;
  userName: string;
  streakDays?: number | undefined;
  childName?: string | undefined;
  childLevel?: number | undefined;
};

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-teal">
      <div
        className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold"
        aria-hidden="true"
      >
        CQ
      </div>
      <span className="text-sm font-bold tracking-tight text-text-primary">Crystal Code Quest</span>
    </Link>
  );
}

function TopBar({
  userRole,
  userName,
  streakDays,
}: {
  userRole: "child" | "parent";
  userName: string;
  streakDays?: number | undefined;
}) {
  const isParent = userRole === "parent";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6 lg:px-8">
      <Brand />
      <div className="flex items-center gap-3">
        {isParent ? (
          <span className="hidden text-xs font-bold uppercase tracking-widest text-text-muted sm:inline-block">
            Parent account
          </span>
        ) : null}
        {!isParent && streakDays !== undefined && streakDays > 0 ? (
          <div className="text-primary flex items-center gap-1.5 rounded-full border border-border bg-elevated px-2.5 py-1 text-xs font-bold">
            <svg aria-hidden="true" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path d="M10 2C10 2 6 6 6 10C6 12.5 7.5 15 10 15C12.5 15 14 12.5 14 10C14 6 10 2 10 2ZM10 13C8.5 13 8 11.5 8 10C8 8 9.5 5.5 10 4.5C10.5 5.5 12 8 12 10C12 11.5 11.5 13 10 13Z" />
            </svg>
            <span className="sr-only">Streak:</span>
            {streakDays} DAY{streakDays === 1 ? "" : "S"}
          </div>
        ) : null}
        <div className="flex items-center gap-2 pl-2">
          {isParent ? (
            <ParentAvatar alt={`${userName} profile`} className="h-8 w-8 rounded-full" />
          ) : (
            <ChildAvatar alt={`${userName} profile`} className="h-8 w-8 rounded-full" />
          )}
          <form action={logout}>
            <button
              type="submit"
              className="hover:border-primary hover:text-primary focus-visible:ring-primary rounded-lg border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary transition focus-visible:ring-2"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}

function SideNav({
  items,
  currentPath,
  userRole,
  userName,
  childName,
  childLevel,
}: {
  items: NavItem[];
  currentPath: string;
  userRole: "child" | "parent";
  userName: string;
  childName?: string | undefined;
  childLevel?: number | undefined;
}) {
  const isParent = userRole === "parent";
  const displayName = isParent ? (childName ?? userName) : userName;

  return (
    <nav
      className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-64 flex-col border-r border-border bg-surface p-4 md:flex"
      aria-label={isParent ? "Parent navigation" : "Child navigation"}
    >
      <div className="border-border/50 mb-6 border-b pb-4">
        <div className="flex items-center gap-3">
          {isParent ? (
            <ChildAvatar alt={`${displayName} profile`} className="h-10 w-10 rounded-lg" />
          ) : (
            <ChildAvatar alt={`${displayName} profile`} className="h-10 w-10 rounded-lg" />
          )}
          <div>
            <p className="text-base font-bold text-text-primary">{displayName}</p>
            <p className="text-xs font-medium text-text-muted">
              {isParent ? "Selected child" : "Level " + (childLevel ?? 1)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive = currentPath === item.href;
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${
                isActive
                  ? "border-primary bg-primary/10 text-primary border-l-2"
                  : "text-text-muted hover:bg-elevated hover:text-text-secondary"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.planned ? (
                <span className="rounded bg-elevated px-1.5 py-0.5 text-[10px] font-bold text-text-muted">
                  SOON
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="border-border/50 mt-auto border-t pt-4">
        <p className="text-xs text-text-muted">
          {isParent
            ? "Supervisory view only. Child sign-in is separate."
            : "This is your learning space. Have fun building."}
        </p>
      </div>
    </nav>
  );
}

function MobileNav({ items, currentPath }: { items: NavItem[]; currentPath: string }) {
  const visibleItems = items.slice(0, 4);

  return (
    <nav
      className="pb-safe fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-surface px-2 md:hidden"
      aria-label="Mobile navigation"
    >
      {visibleItems.map((item) => {
        const isActive = currentPath === item.href;
        return (
          <Link
            key={item.href + item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition ${
              isActive ? "bg-primary/10 text-primary" : "text-text-muted hover:text-text-secondary"
            }`}
          >
            <span className="flex h-5 w-5 items-center justify-center" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function DashboardNav(props: DashboardNavProps) {
  return (
    <>
      <TopBar userRole={props.userRole} userName={props.userName} streakDays={props.streakDays} />
      <SideNav
        items={getNavItems(props.userRole)}
        currentPath={props.currentPath}
        userRole={props.userRole}
        userName={props.userName}
        childName={props.childName}
        childLevel={props.childLevel}
      />
      <MobileNav items={getMobileNavItems(props.userRole)} currentPath={props.currentPath} />
    </>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M3 8L10 3L17 8V17H12V13H8V17H3V8Z" />
    </svg>
  );
}

function QuestIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M6 2H14M7 2L4 16C4 17 5 18 6 18H14C15 18 16 17 16 16L13 2" />
      <path d="M8 8H12" />
    </svg>
  );
}

function AdventureIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M10 2L13 8L19 9L15 14L16 20L10 17L4 20L5 14L1 9L7 8L10 2Z" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M5 4H15V8C15 11 12.5 13 10 13C7.5 13 5 11 5 8V4Z" />
      <path d="M8 13V16H12V13" />
      <path d="M5 17H15" />
      <path d="M2 4H5M15 4H18" />
    </svg>
  );
}

function LearnIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M3 6C3 4 5 3 10 3C15 3 17 4 17 6V14C17 16 15 17 10 17C5 17 3 16 3 14V6Z" />
      <path d="M10 11C12.5 11 14 10 14 9" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2V5M10 15V18M2 10H5M15 10H18M4.2 4.2L6.4 6.4M13.6 13.6L15.8 15.8M4.2 15.8L6.4 13.6M13.6 6.4L15.8 4.2" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <circle cx="10" cy="10" r="8" />
      <path d="M7.5 8.5C7.5 8.5 8 6 10 6C12 6 12.5 7.5 12.5 8.5C12.5 10.5 10 11 10 13" />
      <circle cx="10" cy="15" r="1" fill="currentColor" />
    </svg>
  );
}

function OverviewIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  );
}

function JournalIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M4 2H16C17 2 18 3 18 4V16C18 17 17 18 16 18H4C3 18 2 17 2 16V4C2 3 3 2 4 2Z" />
      <path d="M6 2V18" />
      <path d="M9 6H14M9 10H14M9 14H12" />
    </svg>
  );
}

function BuildsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M2 14L5 11L9 15L14 10L18 14" />
      <path d="M2 10L5 7L9 11L14 6L18 10" />
    </svg>
  );
}

function SafetyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
      <path d="M10 2L17 5V9C17 13.5 14 17 10 18C6 17 3 13.5 3 9V5L10 2Z" />
      <path d="M7 10L9 12L13 8" />
    </svg>
  );
}

function getNavItems(role: "child" | "parent"): NavItem[] {
  if (role === "child") {
    return [
      { href: "/child", label: "Dashboard", icon: <HomeIcon /> },
      { href: "/child/quests", label: "Quests", icon: <QuestIcon /> },
      { href: "/child", label: "Prompt Lab", icon: <LabIcon />, planned: true },
      { href: "/child", label: "My Adventure", icon: <AdventureIcon />, planned: true },
      { href: "/child", label: "Achievements", icon: <TrophyIcon />, planned: true },
      { href: "/child", label: "Learn", icon: <LearnIcon />, planned: true },
      { href: "/child", label: "Settings", icon: <SettingsIcon />, planned: true },
      { href: "/child", label: "Support", icon: <SupportIcon />, planned: true },
    ];
  }

  return [
    { href: "/parent", label: "Overview", icon: <OverviewIcon /> },
    { href: "/parent", label: "Learning", icon: <LearnIcon />, planned: true },
    { href: "/parent", label: "Prompt Lab", icon: <LabIcon />, planned: true },
    { href: "/parent", label: "Journal", icon: <JournalIcon />, planned: true },
    { href: "/parent", label: "Builds", icon: <BuildsIcon />, planned: true },
    { href: "/parent", label: "Safety", icon: <SafetyIcon />, planned: true },
    { href: "/parent", label: "Settings", icon: <SettingsIcon />, planned: true },
    { href: "/parent", label: "Support", icon: <SupportIcon />, planned: true },
  ];
}

function getMobileNavItems(role: "child" | "parent"): NavItem[] {
  if (role === "child") {
    return [
      { href: "/child", label: "Home", icon: <HomeIcon /> },
      { href: "/child/quests", label: "Quests", icon: <QuestIcon /> },
      { href: "/child/quests", label: "Lab", icon: <LabIcon /> },
      { href: "/child", label: "Profile", icon: <ChildAvatar alt="Profile" className="h-4 w-4" /> },
    ];
  }

  return [
    { href: "/parent", label: "Overview", icon: <OverviewIcon /> },
    { href: "/parent", label: "Learning", icon: <LearnIcon /> },
    { href: "/parent", label: "Journal", icon: <JournalIcon /> },
    { href: "/parent", label: "Builds", icon: <BuildsIcon /> },
  ];
}
