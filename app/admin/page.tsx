import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "../../lib/auth";
import { listApplications, serializeApplication } from "../../lib/applications";
import { AdminDashboard } from "./AdminDashboard";

export const metadata: Metadata = { title: "队长审核台" };

export default async function AdminPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  const applications = listApplications(admin).map(serializeApplication);
  return <AdminDashboard admin={admin} initialApplications={applications} />;
}
