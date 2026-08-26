import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TenantCard from "../../components/TenantCard";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";

function Tenants() {
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
                setError("Failed to load tenants. Is the server running?");
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

    const activeTenants = tenants.filter((t) => t.status === "Active");
    const pendingTenants = tenants.filter((t) => t.status === "Pending");

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
                <PageHeader
                    title="Tenant Management"
                    subtitle={`${tenants.length} total tenant${tenants.length !== 1 ? "s" : ""} — ${activeTenants.length} active, ${pendingTenants.length} pending`}
                />

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <section className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-base font-semibold text-gray-800">Pending Requests</h2>
                        {pendingTenants.length > 0 && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                {pendingTenants.length}
                            </span>
                        )}
                    </div>

                    {pendingTenants.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white">
                            <EmptyState icon="🎉" message="No pending requests" sub="All applications have been reviewed." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {pendingTenants.map((tenant) => (
                                <TenantCard
                                    key={tenant._id}
                                    tenant={tenant}
                                    onAccept={handleAccept}
                                    loading={acceptingId === tenant._id}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <section>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeTenants.map((tenant) => (
                                <TenantCard key={tenant._id} tenant={tenant} onAccept={handleAccept} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Tenants;