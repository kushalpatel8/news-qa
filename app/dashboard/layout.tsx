import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { hasAccess } from "@/lib/auth/rbac";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user && !user.publicMetadata?.role) {
    const cookieStore = await cookies();
    const hasPendingRole = cookieStore.has("pending_role");
    if (hasPendingRole) {
      redirect("/api/user/apply-role");
    } else {
      redirect("/role-select");
    }
  }

  const role = user?.publicMetadata?.role as string;
  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const userName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const initials = (firstName.charAt(0) || "U").toUpperCase();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--content-bg)" }}>
      {/* Sidebar */}
      <Sidebar userName={userName} role={role} initials={initials} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar userName={userName} role={role} initials={initials} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
