import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import TenantCard from "../../components/TenantCard";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import { getUser } from "../../utils/auth";

const POLL_INTERVAL = 5000;

function Admin() {
    const user = getUser();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);
    const [error, setError] = useState("");

    // Water charge settings
    const [waterCharge, setWaterCharge] = useState(400);
    const [editingWater, setEditingWater] = useState(false);
    const [waterInput, setWaterInput] = useState("400");
    const [savingWater, setSavingWater] = useState(false);
    const [waterError, setWaterError] = useState("");

    // Fetch settings once on mount
    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then((r) => r.json())
            .then((data) => {
                if (data.waterCharge !== undefined) {
                    setWaterCharge(data.waterCharge);
                    setWaterInput(String(data.waterCharge));
                }
            })
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
            .catch(() => setError("Failed to load tenant data."))
            .finally(() => { if (!silent) setLoading(false); });
    }, []);

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
            }
        } finally {
            setAcceptingId(null);
        }
    };

    const handleSaveWaterCharge = async () => {
        const value = Number(waterInput);
        if (isNaN(value) || value < 0) {
            setWaterError("Enter a valid non-negative number.");
            return;
        }
        setSavingWater(true);
        setWaterError("");
        try {
            const res = await fetch("http://localhost:5000/api/settings/water-charge", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ waterCharge: value }),
            });
            if (res.ok) {
                setWaterCharge(value);
                setEditingWater(false);
            } else {
                setWaterError("Failed to save. Try again.");
            }
        } catch {
            setWaterError("Could not connect to server.");
        } finally {
            setSavingWater(false);
        }
    };

    const active = tenants.filter((t) => t.status === "Active");
    const pending = tenants.filter((t) => t.status === "Pending");
    const recentPending = pending.slice(0, 3);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <PageHeader
                    title={`Welcome back, ${user?.name || "Admin"}`}
                    subtitle="Here's a quick overview of your property."
                />

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <StatCard label="Total Tenants"    value={loading ? "—" : tenants.length} icon="👥" color="blue" />
                    <StatCard label="Active Tenants"   value={loading ? "—" : active.length}  icon="✅" color="green" />
                    <StatCard label="Pending Requests" value={loading ? "—" : pending.length} icon="⏳" color="yellow" />
                    <StatCard label="Total Meters"     value="—"                               icon="⚡" color="gray" />
                </div>

                {/* Quick-links */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Link to="/tenants" className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Manage Tenants</p>
                            <p className="text-xs text-gray-400 mt-0.5">View Active &amp; Pending tenants</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
                    </Link>
                    <Link to="/meters" className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Manage Meters</p>
                            <p className="text-xs text-gray-400 mt-0.5">View and add utility meters</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
                    </Link>
                    <Link to="/transactions" className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Transactions</p>
                            <p className="text-xs text-gray-400 mt-0.5">View payment history</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
                    </Link>
                </div>

                {/* Water Charge Settings card */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">💧</div>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Water Charge</p>
                                <p className="text-xs text-gray-400 mt-0.5">Applied to all tenant bills every month</p>
                            </div>
                        </div>

                        {editingWater ? (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                                    <span className="px-2.5 text-sm text-gray-500 bg-gray-50 border-r border-gray-300 py-2">₹</span>
                                    <input
                                        id="water-charge-input"
                                        type="number"
                                        min="0"
                                        value={waterInput}
                                        onChange={(e) => { setWaterInput(e.target.value); setWaterError(""); }}
                                        className="w-24 px-2.5 py-2 text-sm text-gray-800 focus:outline-none"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    onClick={handleSaveWaterCharge}
                                    disabled={savingWater}
                                    className="px-3 py-2 rounded-lg bg-blue-600 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                                >
                                    {savingWater ? "Saving…" : "Save"}
                                </button>
                                <button
                                    onClick={() => { setEditingWater(false); setWaterInput(String(waterCharge)); setWaterError(""); }}
                                    className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-blue-700">₹{waterCharge.toLocaleString()}</span>
                                <button
                                    id="edit-water-charge-btn"
                                    onClick={() => { setEditingWater(true); setWaterInput(String(waterCharge)); }}
                                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                >
                                    ✏️ Edit
                                </button>
                            </div>
                        )}
                    </div>
                    {waterError && (
                        <p className="text-xs text-red-600 mt-2 pl-13">{waterError}</p>
                    )}
                </div>

                {/* Recent pending requests */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                            Pending Requests
                        </h2>
                        {pending.length > 3 && (
                            <Link to="/tenants" className="text-sm text-blue-600 hover:underline font-medium">
                                View all ({pending.length})
                            </Link>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 mb-4">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {loading ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-400 text-sm">Loading tenants...</p>
                        </div>
                    ) : recentPending.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white">
                            <EmptyState icon="🎉" message="No pending requests" sub="All tenant applications have been reviewed." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentPending.map((tenant) => (
                                <TenantCard
                                    key={tenant._id}
                                    tenant={tenant}
                                    onAccept={handleAccept}
                                    loading={acceptingId === tenant._id}
                                    waterCharge={waterCharge}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Admin;