"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, PenTool, TestTube, Code2, ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const roles = [
  {
    id: "ADMIN",
    title: "Administrator",
    description: "Full access to all system metrics, bugs, and configuration.",
    icon: Shield,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20 hover:border-rose-500/50",
  },
  {
    id: "EDITOR",
    title: "Editor",
    description: "Focus on publishing, reviewing, and tracking article defects.",
    icon: PenTool,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:border-blue-500/50",
  },
  {
    id: "QA",
    title: "QA Engineer",
    description: "Execute test cases, perform API tests, and track all bugs.",
    icon: TestTube,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:border-emerald-500/50",
  },
  {
    id: "VIEWER",
    title: "Viewer",
    description: "Read-only access to view dashboards, tests, and reports.",
    icon: Code2,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20 hover:border-purple-500/50",
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [adminToken, setAdminToken] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we already have a role locally on the client object, push them to dashboard
  if (isLoaded && user?.publicMetadata?.role) {
    router.push("/dashboard");
    return null;
  }

  const handleContinue = async () => {
    if (!selectedRole) return;
    setError("");
    
    // Verify Admin token if they chose ADMIN
    if (selectedRole === "ADMIN") {
      if (!adminToken) {
        setError("Admin token is required.");
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await fetch("/api/admin/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: adminToken }),
        });
        const data = await res.json();
        
        if (!data.valid) {
          setError(data.error || "Invalid admin token.");
          setIsSubmitting(false);
          return;
        }
        // Save the valid admin token in cookie to verify securely on the server later
        document.cookie = `admin_token=${adminToken}; path=/; max-age=3600`;
      } catch (err) {
        setError("Failed to verify token.");
        setIsSubmitting(false);
        return;
      }
    }

    // Store the selected role in a cookie before going to Clerk sign-up
    document.cookie = `pending_role=${selectedRole}; path=/; max-age=3600`;
    
    // If they are already signed in but had no role, we can send them to the auto-apply endpoint
    if (user) {
      window.location.href = "/api/user/apply-role";
    } else {
      // Otherwise they are new/not signed in, go to sign up
      router.push("/sign-up");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Welcome to NewsQA</h1>
          <p className="text-slate-400 text-lg">To tailor your experience, please select your primary role before signing up.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {roles.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRole(r.id)}
                className={`flex items-start gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                    : "border-slate-800 bg-slate-900 hover:border-slate-700"
                }`}
              >
                <div className={`p-3 rounded-xl ${isSelected ? "bg-indigo-500 text-white" : r.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold mb-1 ${isSelected ? "text-white" : "text-slate-200"}`}>
                    {r.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{r.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {selectedRole === "ADMIN" && (
          <div className="mb-8 max-w-sm mx-auto">
            <label className="block text-sm font-medium text-slate-300 mb-2 text-center">
              Enter Admin Token
            </label>
            <input
              type="password"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 text-center tracking-widest"
              placeholder="••••••••"
            />
            {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || isSubmitting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] disabled:shadow-none"
          >
            Continue to Sign Up
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
