import { redirect } from "next/navigation";
import { requireChild } from "@/lib/auth/guards";
import { getLatestQuestSelectionForChild } from "@/lib/db/queries";

export const metadata = {
  title: "Your quest — Crystal Code Quest",
};

export default async function ChildQuestHomePage() {
  const child = await requireChild();
  const selection = getLatestQuestSelectionForChild(child.profileId);

  if (!selection) {
    redirect("/child/quests");
  }

  if (selection.status === "success") {
    redirect(`/child/quests/${selection.id}/success`);
  }

  redirect(`/child/quests/${selection.id}`);
}
