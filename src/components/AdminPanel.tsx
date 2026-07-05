import React, { useState, useEffect } from "react";
import { 
  Lock, 
  Unlock, 
  Search, 
  X, 
  Users, 
  RefreshCw, 
  AlertCircle,
  FileSpreadsheet,
  Check
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WaitlistEntry } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateStats: () => void;
}

export default function AdminPanel({ isOpen, onClose, onUpdateStats }: AdminPanelProps) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const adminToken = sessionStorage.getItem("pubo_admin_token");
    if (adminToken === "admin_session_pubo") {
      setIsAuthenticated(true);
      fetchEntries();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/waitlist/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      sessionStorage.setItem("pubo_admin_token", "admin_session_pubo");
      setIsAuthenticated(true);
      fetchEntries();
    } catch (err: any) {
      setError(err.message || "Invalid passcode.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEntries = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch("/api/waitlist/admin/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: "puboauth2026" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to load entries.");
      }

      setEntries(data.entries);
    } catch (err: any) {
      setError(err.message || "Failed to retrieve registration data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm("Are you sure you want to wipe the waitlist database? All registrations will be cleared.")) {
      return;
    }

    setError(null);
    try {
      const response = await fetch("/api/waitlist/admin/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: "puboauth2026" }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to clear database.");
      }

      setEntries(data.entries);
      onUpdateStats();
      setSuccessMsg("Waitlist database successfully cleared of all registrations!");
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setError(err.message || "Clear failed.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pubo_admin_token");
    setIsAuthenticated(false);
    setEntries([]);
    setPasscode("");
  };

  const handleExportCSV = () => {
    if (entries.length === 0) return;

    const headers = ["ID", "Email", "Role", "Platforms", "Referral Code", "Referral Count", "Registration Date"];
    const rows = entries.map(entry => [
      entry.id,
      entry.email,
      entry.role,
      `"${entry.platforms.join(", ")}"`,
      entry.referralCode,
      entry.referralCount,
      entry.createdAt
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pubo_waitlist_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMetrics = () => {
    const roles: Record<string, number> = {};
    const platforms: Record<string, number> = {};
    
    entries.forEach(entry => {
      roles[entry.role] = (roles[entry.role] || 0) + 1;
      entry.platforms.forEach(p => {
        platforms[p] = (platforms[p] || 0) + 1;
      });
    });

    return { roles, platforms };
  };

  const { roles: roleMetrics, platforms: platformMetrics } = getMetrics();

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          entry.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || entry.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm transition-all duration-300">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-5xl h-[85vh] flex flex-col bg-card border border-border rounded-xl shadow-xl overflow-hidden text-editorial-ink transition-all duration-300"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-b border-border transition-colors duration-200">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center bg-brand-500 text-white rounded-lg shadow-sm">
              {isAuthenticated ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider font-sans">PUBO Admin Console</h3>
              <p className="text-[10px] text-editorial-ink-light font-mono uppercase tracking-wide">Administrative Waitlist Core</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-border hover:bg-muted text-editorial-ink rounded-lg transition-all cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Core Screen */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/5">
          {!isAuthenticated ? (
            /* AUTHENTICATION PROMPT */
            <div className="h-full flex items-center justify-center max-w-sm mx-auto">
              <div className="w-full space-y-5 bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/20 rounded-lg flex items-center justify-center text-brand-500 mx-auto mb-3">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-wider">Passcode Required</h4>
                  <p className="text-xs text-editorial-ink-light mt-1.5 leading-relaxed">
                    Verify authorization to inspect, search, and export registration cohorts.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <input
                      type="password"
                      required
                      placeholder="Enter console passcode..."
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-muted/20 border border-border rounded-lg text-xs text-center font-mono focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 text-editorial-ink transition-all duration-200"
                    />
                  </div>

                  {error && (
                    <div className="bg-rose-500/10 border border-rose-500/25 rounded-lg px-3.5 py-2 text-rose-500 text-xs font-bold font-mono flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full duo-btn-purple text-xs py-2.5"
                  >
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span>UNLOCK DATABASE</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* REVEALED DASHBOARD */
            <div className="space-y-6">
              
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-4 py-3 text-editorial-ink font-bold text-xs flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Metric Card: Total */}
                <div className="bg-card border border-border rounded-xl p-5 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-editorial-ink-light uppercase tracking-widest">[PERSISTED REGISTRANTS]</span>
                    <h4 className="text-2.5xl font-bold text-editorial-ink tracking-tight font-mono mt-1">
                      {entries.length.toLocaleString()}
                    </h4>
                    <p className="text-[11px] text-editorial-ink-light mt-1">
                      Verified database table registrations.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-xs text-brand-500 font-bold uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Real-time persistence active</span>
                  </div>
                </div>

                {/* Metric Card: Top Platforms */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <span className="text-[9px] font-mono font-bold text-editorial-ink-light uppercase tracking-widest">[TARGET PLATFORMS]</span>
                  <div className="mt-3.5 space-y-2.5">
                    {Object.entries(platformMetrics)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([plat, count]) => {
                        const total = entries.length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={plat} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-editorial-ink font-bold uppercase tracking-tight">{plat}</span>
                              <span className="text-editorial-ink-light font-mono font-bold">{count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted border border-border overflow-hidden rounded">
                              <div className="h-full bg-brand-500" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Metric Card: Roles Breakdown */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <span className="text-[9px] font-mono font-bold text-editorial-ink-light uppercase tracking-widest">[COHORT PROFILES]</span>
                  <div className="mt-3.5 space-y-2.5">
                    {Object.entries(roleMetrics)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([role, count]) => {
                        const total = entries.length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={role} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-editorial-ink font-bold uppercase tracking-tight">{role}</span>
                              <span className="text-editorial-ink-light font-mono font-bold">{count} ({pct}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted border border-border overflow-hidden rounded">
                              <div className="h-full bg-brand-400" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

              </div>

              {/* Data Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                {/* Search / Filter action bar */}
                <div className="p-4 bg-muted/10 border-b border-border flex flex-col sm:flex-row gap-3 justify-between items-center">
                  
                  {/* Left: Inputs */}
                  <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-ink-light" />
                      <input
                        type="text"
                        placeholder="Search waitlist..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-64 pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-xs text-editorial-ink focus:outline-none focus:ring-2 focus:ring-brand-500/15 focus:border-brand-500 transition-all duration-200"
                      />
                    </div>
                    {/* Filter Role */}
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="px-4 py-2 bg-card border border-border rounded-lg text-xs text-editorial-ink focus:outline-none font-bold uppercase tracking-wide cursor-pointer hover:border-brand-500/30 transition-all"
                    >
                      <option value="all">ALL ROLES</option>
                      <option value="Content Creator">CREATORS</option>
                      <option value="Marketing Manager">MARKETING MANAGERS</option>
                      <option value="Solo Founder">FOUNDERS</option>
                      <option value="Agency Owner">AGENCY OWNERS</option>
                    </select>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={fetchEntries}
                      className="p-2.5 border border-border bg-card hover:bg-muted text-editorial-ink rounded-lg transition-all cursor-pointer flex items-center justify-center"
                      title="Sync Data"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                    >
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={handleResetData}
                      className="px-4 py-2 bg-card border border-border hover:bg-rose-500/10 text-rose-500 hover:border-rose-500/30 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Wipe DB</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-editorial-ink text-editorial-bg hover:opacity-90 border border-border rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <span>Lock Console</span>
                    </button>
                  </div>

                </div>

                {/* Table container */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border text-[10px] font-mono font-bold text-editorial-ink-light uppercase tracking-wider select-none">
                        <th className="px-5 py-3.5">Registration Date</th>
                        <th className="px-5 py-3.5">Email Address</th>
                        <th className="px-5 py-3.5">Role</th>
                        <th className="px-5 py-3.5">Channels</th>
                        <th className="px-5 py-3.5 text-center">Referral Code</th>
                        <th className="px-5 py-3.5 text-center">Referrals</th>
                        <th className="px-5 py-3.5 text-center">Queue Position</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40 text-xs text-editorial-ink">
                      {filteredEntries.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-editorial-ink-light font-sans italic">
                            No waitlist registrations found matching those filter parameters.
                          </td>
                        </tr>
                      ) : (
                        filteredEntries.map((entry) => (
                          <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-5 py-3.5 font-mono text-editorial-ink-light text-[10px] uppercase">
                              {new Date(entry.createdAt).toLocaleDateString()} {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-5 py-3.5 font-bold">
                              {entry.email}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2.5 py-1 bg-brand-500/10 text-brand-500 border border-brand-500/15 text-[9px] font-bold uppercase tracking-wider rounded-md">
                                {entry.role}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              <div className="flex flex-wrap gap-1">
                                {entry.platforms.map((p, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-card border border-border text-editorial-ink-light text-[9px] font-mono font-bold uppercase rounded">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-black text-brand-500 uppercase">
                              {entry.referralCode}
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-bold">
                              {entry.referralCount}
                            </td>
                            <td className="px-5 py-3.5 text-center font-mono font-black text-brand-500">
                              #{entry.position.toLocaleString()}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Footer Count */}
                <div className="p-3.5 bg-muted/40 border-t border-border text-center text-[10px] text-editorial-ink-light font-mono uppercase tracking-wider font-bold">
                  Showing {filteredEntries.length} of {entries.length} persistent registrations
                </div>

              </div>

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
