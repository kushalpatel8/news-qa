import { enforceAccess } from "@/lib/auth/rbac";
import UserManagementTable from "@/components/admin/UserManagementTable";

export const metadata = {
  title: "Admin Settings | NewsQA",
  description: "Manage users and roles",
};

export default async function SettingsPage() {
  await enforceAccess("SETTINGS");

  return (
    <div className="p-6 max-w-[1400px] space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          Manage user access, review roles, and configure platform settings.
        </p>
      </div>

      <div className="card p-5 space-y-4">
        <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>User Management</h2>
        <UserManagementTable />
      </div>
    </div>
  );
}

