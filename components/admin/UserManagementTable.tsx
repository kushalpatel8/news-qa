"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, UserCheck, Search, Trash2 } from "lucide-react";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  role: string;
  createdAt: number;
}

export default function UserManagementTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/update-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (!res.ok) throw new Error("Failed to update role");
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert("Error updating role: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    setDeletingId(userId);
    try {
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      
      setUsers(users.filter(u => u.id !== userId));
    } catch (err: any) {
      alert("Error deleting user: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-700";
      case "EDITOR": return "bg-indigo-100 text-indigo-700";
      case "QA": return "bg-purple-100 text-purple-700";
      case "VIEWER": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-4 border-b border-[#6D8196]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#CBCBCB]" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base pl-9 pr-4 py-1.5 w-full sm:w-64 text-xs"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-[#CBCBCB]">
          <UserCheck className="w-4 h-4" />
          <span>Total Users: {users.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Joined</th>
              <th>Current Role</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td className="whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-[#6D8196]/30 rounded-full flex items-center justify-center text-[#FFFFE3] text-xs font-bold border border-[#6D8196]">
                      {(u.firstName?.[0] || "") + (u.lastName?.[0] || "") || "U"}
                    </div>
                    <div className="ml-3">
                      <div className="text-xs font-semibold text-[#FFFFE3]">{u.firstName} {u.lastName}</div>
                      <div className="text-[11px] text-[#CBCBCB]">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap text-xs text-[#CBCBCB]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap">
                  <span className={`badge ${
                    u.role === "ADMIN" ? "badge-critical" :
                    u.role === "EDITOR" ? "badge-ready" :
                    u.role === "QA" ? "badge-high" : "badge-passed"
                  }`}>
                    {u.role === "NONE" ? "PENDING" : u.role}
                  </span>
                </td>
                <td className="whitespace-nowrap text-right text-xs font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {updatingId === u.id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#6D8196] inline-block" />
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="input-base text-xs py-1 px-2"
                      >
                        <option value="NONE" disabled>Select Role...</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                        <option value="QA">QA</option>
                        <option value="VIEWER">VIEWER</option>
                      </select>
                    )}
                    
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      disabled={deletingId === u.id}
                      className="p-1.5 text-[#CBCBCB] hover:text-rose-400 hover:bg-[#722f37]/30 rounded-md transition-colors disabled:opacity-50"
                      title="Delete User"
                    >
                      {deletingId === u.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-[#CBCBCB]">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
