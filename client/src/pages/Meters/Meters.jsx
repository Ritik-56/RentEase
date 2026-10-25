import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import MeterCard from "../../components/MeterCard";
import AddMeterModal from "../../components/AddMeterModal";
import EditMeterModal from "../../components/EditMeterModal";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";

const POLL_INTERVAL = 5000;

function Meters() {
    const [meters, setMeters] = useState([]);
    const [activeTenants, setActiveTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [editingMeter, setEditingMeter] = useState(null);

    const fetchData = useCallback((silent = false) => {
        if (!silent) setLoading(true);
        Promise.all([
            fetch("http://localhost:5000/api/meters").then((r) => r.json()),
            fetch("http://localhost:5000/api/tenants").then((r) => r.json()),
        ])
            .then(([metersData, tenantsData]) => {
                setMeters(Array.isArray(metersData) ? metersData : []);
                const allTenants = Array.isArray(tenantsData) ? tenantsData : [];
                setActiveTenants(allTenants.filter((t) => t.status === "Active"));
                setError("");
            })
            .catch(() => setError("Failed to load data. Is the server running?"))
            .finally(() => { if (!silent) setLoading(false); });
    }, []);

    // Initial load + real-time polling
    useEffect(() => {
        fetchData(false);
        const interval = setInterval(() => fetchData(true), POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleMeterAdded = (newMeter) => {
        setMeters((prev) => [newMeter, ...prev]);
    };

    const handleMeterUpdated = (updatedMeter) => {
        setMeters((prev) =>
            prev.map((m) => (m._id === updatedMeter._id ? updatedMeter : m))
        );
    };

    // Only offer tenants in the Add Meter dropdown who don't already have a meter
    const tenantsWithoutMeter = activeTenants.filter(
        (t) => !meters.some((m) => m.tenantId?.toString() === t.userId?.toString())
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <PageHeader
                    title="Meter Management"
                    subtitle={`${meters.length} meter${meters.length !== 1 ? "s" : ""} registered`}
                    action={
                        <button
                            id="open-add-meter-btn"
                            onClick={() => setAddModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-base leading-none">+</span>
                            Add Meter
                        </button>
                    }
                />

                {error && (
                    <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-gray-400">Loading meters...</p>
                    </div>
                ) : meters.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white">
                        <EmptyState
                            icon="⚡"
                            message="No meters added yet"
                            sub="Click 'Add Meter' to assign a meter to a tenant."
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meters.map((meter) => (
                            <MeterCard
                                key={meter._id}
                                meter={meter}
                                onEdit={(m) => setEditingMeter(m)}
                            />
                        ))}
                    </div>
                )}
            </main>

            <AddMeterModal
                isOpen={addModalOpen}
                onClose={() => setAddModalOpen(false)}
                onMeterAdded={handleMeterAdded}
                activeTenants={tenantsWithoutMeter}
            />

            <EditMeterModal
                isOpen={!!editingMeter}
                meter={editingMeter}
                onClose={() => setEditingMeter(null)}
                onMeterUpdated={handleMeterUpdated}
            />
        </div>
    );
}

export default Meters;
