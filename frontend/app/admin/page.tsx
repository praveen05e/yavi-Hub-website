import { redirect } from "next/navigation";

export default function AdminPage() {
  // Redirect /admin to the dashboard.
  // The layout/middleware will handle authentication and redirect to /admin/login if not logged in.
  redirect("/admin/dashboard");
}
