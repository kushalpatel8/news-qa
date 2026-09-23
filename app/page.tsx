import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Bot,
  BarChart3,
  TestTube,
  Sparkles,
  Layers,
  Users,
  FileText,
  Activity,
  Globe,
  Flame,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { HeroInteractivePreview, RoleCapabilitiesTabs } from "@/components/landing/LandingInteractive";
import LandingUserNav from "@/components/landing/LandingUserNav";

export default async function LandingPage() {
  const user = await currentUser();
  const role = (user?.publicMetadata?.role as string) || "";

  return (
    <div className="min-h-screen bg-[#070F1E] text-[#E2F1FF] selection:bg-[#00E676]/30 font-sans relative overflow-x-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-[#00E676]/15 via-[#00E5FF]/10 to-[#070F1E] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[600px] h-[600px] bg-[#00E5FF]/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-[1600px] left-0 w-[600px] h-[600px] bg-[#00E676]/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1E3A5F] bg-[#070F1E]/90 backdrop-blur-xl shadow-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition group">
            <div className="p-2 rounded-xl bg-[#00E676] shadow-md shadow-[#00E676]/30 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-[#070F1E]" />
            </div>
            <span className="font-black text-xl tracking-tight text-[#E2F1FF]">
              NewsQA
            </span>
            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00E676]/15 border border-[#00E676]/40 text-[#00E676]">
              v1.0 LIVE
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="hidden md:flex items-center gap-6 text-[#88A4C4] font-semibold">
              <a href="#features" className="hover:text-[#00E676] transition">Features</a>
              <a href="#roles" className="hover:text-[#00E676] transition">Roles</a>
              <a href="#ai" className="hover:text-[#00E676] transition">NewsGuard AI</a>
              <a href="#metrics" className="hover:text-[#00E676] transition">Metrics</a>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <LandingUserNav role={role} />
              ) : (
                <>
                  <Link href="/sign-in" className="text-xs font-bold text-[#88A4C4] hover:text-[#E2F1FF] transition px-3 py-2">
                    Sign In
                  </Link>
                  <Link
                    href="/role-select"
                    className="flex items-center gap-1.5 text-xs font-bold bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] px-5 py-2.5 rounded-full transition-all shadow-md shadow-[#00E676]/25 hover:-translate-y-0.5"
                  >
                    Get Started <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 text-center">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1B2A] border border-[#1E3A5F] text-[11px] text-[#E2F1FF] font-bold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
            <span>AI-Assisted Quality Assurance Engine for Digital Media</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight text-[#E2F1FF]">
            Elevate News Integrity with
            <br />
            <span className="text-[#00E5FF]">
              AI & Unified QA Workflows.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#88A4C4] max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Streamline test runs, REST API endpoint validation, article quality checks, and defect tracking in a single modern platform powered by NewsGuard AI.
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-[#00E676]/25 hover:-translate-y-0.5"
              >
                Launch Dashboard Workspace <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/role-select"
                  className="flex items-center gap-2 bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] px-6 py-3 rounded-full text-sm font-bold transition-all shadow-md shadow-[#00E676]/25 hover:-translate-y-0.5"
                >
                  Start Testing Now <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#features"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border border-[#1E3A5F] bg-[#0D1B2A] hover:bg-[#13253B] text-[#E2F1FF] transition shadow-sm"
                >
                  Explore Capabilities
                </a>
              </>
            )}
          </div>

          {/* Interactive Live App Mockup */}
          <HeroInteractivePreview />
        </div>
      </section>

      {/* Live Statistics Bar */}
      <section id="metrics" className="py-10 border-y border-[#1E3A5F] bg-[#0D1B2A]">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#00E676]">99.9%</div>
            <div className="text-[11px] font-bold text-[#88A4C4] mt-1 uppercase tracking-wider">Quality SLA</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#00E5FF]">10x</div>
            <div className="text-[11px] font-bold text-[#88A4C4] mt-1 uppercase tracking-wider">Faster QA Cycles</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#FF9100]">&lt; 50ms</div>
            <div className="text-[11px] font-bold text-[#88A4C4] mt-1 uppercase tracking-wider">API Test Latency</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-[#00E676]">Zero</div>
            <div className="text-[11px] font-bold text-[#88A4C4] mt-1 uppercase tracking-wider">Fact Inaccuracies</div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section id="features" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0D1B2A] border border-[#1E3A5F] text-[11px] font-bold text-[#E2F1FF] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" /> Built for Modern Digital Newsrooms
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-[#E2F1FF]">
            Everything you need to ship quality content.
          </h2>
          <p className="text-[#88A4C4] max-w-xl mx-auto text-xs sm:text-sm mb-12 font-medium">
            From automated test execution and REST API validation to NewsGuard AI fact-checking, NewsQA unifies your entire quality lifecycle.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#00E676] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center mb-4 text-[#00E676] group-hover:scale-110 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">NewsGuard AI Fact-Checker</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Scan article drafts for factual inaccuracies, claim verification, AI probability scoring, and automated news drafting.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#00E5FF] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center mb-4 text-[#00E5FF] group-hover:scale-110 transition-transform">
                <TestTube className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">Full Test Run Suites</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Group test cases into execution suites, mark Passed/Failed/Blocked status step-by-step, and track real-time completion progress.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#FF9100] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#FF9100]/15 border border-[#FF9100]/30 flex items-center justify-center mb-4 text-[#FF9100] group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">Native REST API Engine</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Construct and fire HTTP requests directly from your dashboard. Validate status codes, trace response latency, and check headers.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#00E676] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#00E676]/15 border border-[#00E676]/30 flex items-center justify-center mb-4 text-[#00E676] group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">Article Quality Validation</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Automatically enforce word count thresholds, check category metadata, verify author fields, and detect broken external URLs.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#FF9100] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#FF9100]/15 border border-[#FF9100]/30 flex items-center justify-center mb-4 text-[#FF9100] group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">Defect & Bug Management</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Log detailed bug reports with severity matrix, priority tags, and reproduction steps. Track bug resolution from Open to Closed.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-[#0D1B2A] p-6 rounded-2xl border border-[#1E3A5F] hover:border-[#00E5FF] transition-all duration-300 group hover:-translate-y-1 text-left relative overflow-hidden shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/30 flex items-center justify-center mb-4 text-[#00E5FF] group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#E2F1FF] mb-1.5">Executive Reports & Metrics</h3>
              <p className="text-xs text-[#88A4C4] leading-relaxed font-medium">
                Generate printable executive QA health summaries, export JSON report metrics, and leverage Redis caching for high speed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Capabilities Section */}
      <section id="roles" className="py-20 bg-[#0D1B2A] border-y border-[#1E3A5F] relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070F1E] border border-[#1E3A5F] text-[11px] font-bold text-[#E2F1FF] mb-3">
            <Users className="w-3.5 h-3.5 text-[#00E5FF]" /> Role-Based Access Control
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 text-[#E2F1FF]">
            Tailored Workflows for Every Role
          </h2>
          <p className="text-[#88A4C4] max-w-xl mx-auto text-xs sm:text-sm mb-10 font-medium">
            Explore how NewsQA delivers targeted interfaces and permission controls for QA engineers, journalists, administrators, and observers.
          </p>

          <RoleCapabilitiesTabs />
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="py-20 text-center relative overflow-hidden bg-[#070F1E] text-[#E2F1FF] border-t border-[#1E3A5F]">
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0D1B2A] border border-[#1E3A5F] text-[#E2F1FF] text-[11px] font-bold shadow-xs">
            <Flame className="w-3.5 h-3.5 text-[#FF9100]" /> Start Elevating Your News Quality Today
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#E2F1FF] tracking-tight">
            Ready to transform your QA operations?
          </h2>
          <p className="text-[#88A4C4] text-xs sm:text-sm max-w-lg mx-auto font-medium">
            Experience the speed, precision, and automation of NewsQA today.
          </p>
          <div className="pt-2">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] font-bold text-sm px-7 py-3 rounded-full transition-all shadow-md shadow-[#00E676]/25 hover:-translate-y-0.5"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href="/role-select"
                className="inline-flex items-center gap-2 bg-[#00E676] hover:bg-[#00c853] text-[#070F1E] font-bold text-sm px-7 py-3 rounded-full transition-all shadow-md shadow-[#00E676]/25 hover:-translate-y-0.5"
              >
                Select Role & Get Started <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="mt-24 text-xs text-[#88A4C4] border-t border-[#1E3A5F] pt-8 font-medium">
          &copy; {new Date().getFullYear()} NewsQA Platform. Built with Next.js, Clerk, MongoDB, Upstash Redis & TailwindCSS.
        </div>
      </footer>
    </div>
  );
}
