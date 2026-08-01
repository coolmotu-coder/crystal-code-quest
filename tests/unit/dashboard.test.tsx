import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardShell } from "@/components/dashboard/shell";
import { GuidePanel } from "@/components/dashboard/guide-panel";
import { EmptyState, HexStep, Panel, StatusBadge } from "@/components/dashboard/content";

describe("DashboardShell", () => {
  it("renders child role with navigation and content", () => {
    render(
      <DashboardShell
        userRole="child"
        currentPath="/child"
        userName="Maya"
        streakDays={3}
        childLevel={2}
      >
        <p>Child content</p>
      </DashboardShell>,
    );

    expect(screen.getByText("Child content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Child navigation" })).toBeInTheDocument();
    expect(screen.getByRole("main", { name: "Child dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Maya")).toBeInTheDocument();
    expect(screen.getByText("3 DAYS")).toBeInTheDocument();
  });

  it("renders parent role with child summary", () => {
    render(
      <DashboardShell
        userRole="parent"
        currentPath="/parent"
        userName="Asha"
        childName="Maya"
        childLevel={5}
      >
        <p>Parent content</p>
      </DashboardShell>,
    );

    expect(screen.getByText("Parent content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Parent navigation" })).toBeInTheDocument();
    expect(screen.getByRole("main", { name: "Parent dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Selected child")).toBeInTheDocument();
  });

  it("does not emit invalid ARIA role values from role props", () => {
    const { container: childContainer } = render(
      <DashboardShell userRole="child" currentPath="/child" userName="Maya">
        <p>Child content</p>
      </DashboardShell>,
    );
    expect(childContainer.querySelector('[role="child"]')).not.toBeInTheDocument();

    const { container: parentContainer } = render(
      <DashboardShell userRole="parent" currentPath="/parent" userName="Asha">
        <p>Parent content</p>
      </DashboardShell>,
    );
    expect(parentContainer.querySelector('[role="parent"]')).not.toBeInTheDocument();
  });
});

describe("GuidePanel", () => {
  it("renders guide message, title and action", () => {
    render(
      <GuidePanel
        title="Parent Guide"
        message="Test guide message"
        action={{ href: "/child/quests", label: "Start here" }}
      />,
    );

    expect(screen.getByRole("img", { name: "Warm human guide illustration" })).toBeInTheDocument();
    expect(screen.getByText("Parent Guide")).toBeInTheDocument();
    expect(screen.getByText("Test guide message")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Start here" })).toHaveAttribute(
      "href",
      "/child/quests",
    );
  });
});

describe("HexStep", () => {
  it("renders active step with current number", () => {
    render(<HexStep status="active" number={2} label="Shape the prompt" />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Shape the prompt")).toBeInTheDocument();
  });

  it("renders complete step with checkmark icon", () => {
    render(<HexStep status="complete" number={1} label="Choose an idea" />);
    expect(screen.getByText("Choose an idea")).toBeInTheDocument();
  });

  it("renders pending step with muted styling", () => {
    render(<HexStep status="pending" number={3} label="Review the AI plan" />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it("renders success badge", () => {
    render(<StatusBadge status="success" label="Complete" />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders mocked badge", () => {
    render(<StatusBadge status="mocked" label="Mocked build" />);
    expect(screen.getByText("Mocked build")).toBeInTheDocument();
  });
});

describe("Panel", () => {
  it("renders title and children", () => {
    render(
      <Panel title="Test panel" ariaLabelledBy="test-panel">
        <p>Panel content</p>
      </Panel>,
    );

    expect(screen.getByRole("heading", { name: "Test panel" })).toBeInTheDocument();
    expect(screen.getByText("Panel content")).toBeInTheDocument();
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="Nothing here" description="Start a quest to see data." />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.getByText("Start a quest to see data.")).toBeInTheDocument();
  });
});
