import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";
import TenantCard from "../../components/TenantCard";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";
import { getUser } from "../../utils/auth";

function Admin() {
    const user = getUser();
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [acceptingId, setAcceptingId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/api/tenants")
            .then((res) => res.json())
            .then((data) => {
                setTenants(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load tenant data.");
                setLoading(false);
            });
    }, []);

    const handleAccept = async (tenantId) => {
        setAcceptingId(tenantId);
        const response = await fetch(`http://localhost:5000/api/tenants/${tenantId}/accept`, {
            method: "PATCH",
        });
        setAcceptingId(null);
        if (response.ok) {
            setTenants((prev) =>
                prev.map((t) => (t._id === tenantId ? { ...t, status: "Active" } : t))
            );
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

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Total Tenants" value={loading ? "—" : tenants.length} icon="👥" color="blue" />
                    <StatCard label="Active Tenants" value={loading ? "—" : active.length} icon="✅" color="green" />
                    <StatCard label="Pending Requests" value={loading ? "—" : pending.length} icon="⏳" color="yellow" />
                    <StatCard label="Total Meters" value="—" icon="⚡" color="gray" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/tenants"
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Manage Tenants</p>
                            <p className="text-xs text-gray-400 mt-0.5">View Active &amp; Pending tenants</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
                    </Link>
                    <Link
                        to="/meters"
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow group"
                    >
                        <div>
                            <p className="text-sm font-semibold text-gray-800">Manage Meters</p>
                            <p className="text-xs text-gray-400 mt-0.5">View and add utility meters</p>
                        </div>
                        <span className="text-gray-300 group-hover:text-blue-500 transition-colors text-xl">→</span>
                    </Link>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Pending Requests</h2>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentPending.map((tenant) => (
                                <TenantCard
                                    key={tenant._id}
                                    tenant={tenant}
                                    onAccept={handleAccept}
                                    loading={acceptingId === tenant._id}
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