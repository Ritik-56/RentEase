import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import TenantCard from "../../components/TenantCard";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";

const POLL_INTERVAL = 5000; // ms

function Tenants() {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);
    const [error, setError] = useState("");
    const [waterCharge, setWaterCharge] = useState(400);
    // Mobile: pending drawer open/close
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Fetch water charge once on mount
    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then((r) => r.json())
            .then((data) => { if (data.waterCharge !== undefined) setWaterCharge(data.waterCharge); })
            .catch(() => {});
    }, []);

    const fetchTenants = useCallback((silent = false) => {
        if (!silent) setLoading(true);
        fetch("http://localhost:5000/api/tenants")
            .then((res) => res.json())
            .then((data) => {
                setTenants(Array.isArray(data) ? data : []);
                setError("");
            })
            .catch(() => setError("Failed to load tenants. Is the server running?"))
            .finally(() => { if (!silent) setLoading(false); });
    }, []);

    // Initial load + real-time polling
    useEffect(() => {
        fetchTenants(false);
        const interval = setInterval(() => fetchTenants(true), POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchTenants]);

    const handleAccept = async (tenantId) => {
        setAcceptingId(tenantId);
        try {
            const response = await fetch(`http://localhost:5000/api/tenants/${tenantId}/accept`, {
                method: "PATCH",
            });
            if (response.ok) {
                const data = await response.json();
                setTenants((prev) =>
                    prev.map((t) => (t._id === tenantId ? { ...t, ...data.tenant } : t))
                );
                // Close drawer on mobile after accepting last pending
                if (pendingTenants.length === 1) setDrawerOpen(false);
            }
        } finally {
            setAcceptingId(null);
        }
    };

    const activeTenants = tenants.filter((t) => t.status === "Active");
    const pendingTenants = tenants.filter((t) => t.status === "Pending");

    // ── Pending sidebar panel (reused for both desktop sidebar and mobile drawer) ──
    const PendingPanel = () => (
        <div className="flex flex-col gap-4">
            {pendingTenants.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white">
                    <EmptyState icon="🎉" message="No pending requests" sub="All applications reviewed." />
                </div>
            ) : (
                pendingTenants.map((tenant) => (
                    <TenantCard
                        key={tenant._id}
                        tenant={tenant}
                        onAccept={handleAccept}
                        loading={acceptingId === tenant._id}
                        waterCharge={waterCharge}
                    />
                ))
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center py-32">
                    <p className="text-gray-400">Loading tenants...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* ── Header with mobile pending bell button ── */}
                <div className="flex items-start justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tenant Management</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {tenants.length} total — {activeTenants.length} active, {pendingTenants.length} pending
                        </p>
                    </div>

                    {/* Mobile-only pending bell icon */}
                    <button
                        id="mobile-pending-btn"
                        onClick={() => setDrawerOpen(true)}
                        className="lg:hidden relative flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        aria-label="View pending requests"
                    >
                        <span className="text-xl">🔔</span>
                        {pendingTenants.length > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-white">
                                {pendingTenants.length}
                            </span>
                        )}
                    </button>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {/* ── Desktop: two-column layout ── */}
                <div className="flex gap-6 items-start">

                    {/* LEFT — Active Tenants (main, takes remaining space) */}
                    <section className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4">
                            <h2 className="text-base font-semibold text-gray-800">Active Tenants</h2>
                            {activeTenants.length > 0 && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    {activeTenants.length}
                                </span>
                            )}
                        </div>

                        {activeTenants.length === 0 ? (
                            <div className="rounded-xl border border-gray-200 bg-white">
                                <EmptyState icon="👥" message="No active tenants yet" sub="Accept pending requests to add tenants here." />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                                {activeTenants.map((tenant) => (
                                    <TenantCard key={tenant._id} tenant={tenant} onAccept={handleAccept} waterCharge={waterCharge} />
                                ))}
                            </div>
                        )}
                    </section>

                    {/* RIGHT — Pending Requests sidebar (desktop only) */}
                    <aside className="hidden lg:flex flex-col w-80 flex-shrink-0">
                        <div className="sticky top-20">
                            <div className="flex items-center gap-3 mb-4">
                                <h2 className="text-base font-semibold text-gray-800">Pending Requests</h2>
                                {pendingTenants.length > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                        {pendingTenants.length}
                                    </span>
                                )}
                            </div>
                            <PendingPanel />
                        </div>
                    </aside>
                </div>
            </main>

            {/* ── Mobile Drawer — slide in from right ── */}
            {drawerOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 z-40 bg-black/40"
                        onClick={() => setDrawerOpen(false)}
                    />
                    {/* Drawer panel */}
                    <div className="lg:hidden fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                                <h2 className="text-base font-semibold text-gray-800">Pending Requests</h2>
                                {pendingTenants.length > 0 && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                        {pendingTenants.length}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setDrawerOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                aria-label="Close drawer"
                            >
                                ×
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto px-4 py-4">
                            <PendingPanel />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Tenants;