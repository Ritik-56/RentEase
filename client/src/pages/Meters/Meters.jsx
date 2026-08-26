import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import MeterCard from "../../components/MeterCard";
import AddMeterModal from "../../components/AddMeterModal";
import EmptyState from "../../components/EmptyState";
import PageHeader from "../../components/PageHeader";

const MOCK_METERS = [
    {
        _id: "mock_meter_1",
        meterNumber: "MT-1001",
        currentReading: 1284,
        previousReading: 1150,
        userId: { _id: "mock_user_1", name: "Ravi Kumar", email: "ravi@example.com" },
    },
    {
        _id: "mock_meter_2",
        meterNumber: "MT-1002",
        currentReading: 980,
        previousReading: 870,
        userId: { _id: "mock_user_2", name: "Priya Sharma", email: "priya@example.com" },
    },
    {
        _id: "mock_meter_3",
        meterNumber: "MT-1003",
        currentReading: 2100,
        previousReading: 1940,
        userId: { _id: "mock_user_3", name: "Arjun Nair", email: "arjun@example.com" },
    },
];

function Meters() {
    const [meters, setMeters] = useState([]);
    const [activeTenants, setActiveTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // TODO: replace mock with real fetch when GET /api/meters is ready
        setMeters(MOCK_METERS);

        fetch("http://localhost:5000/api/tenants")
            .then((res) => res.json())
            .then((data) => {
                const all = Array.isArray(data) ? data : [];
                setActiveTenants(all.filter((t) => t.status === "Active"));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleMeterAdded = (newMeter) => {
        setMeters((prev) => [newMeter, ...prev]);
    };

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
                            onClick={() => setModalOpen(true)}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                        >
                            <span className="text-base leading-none">+</span>
                            Add Meter
                        </button>
                    }
                />

                <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                    <p className="text-xs text-blue-600">
                        ⚠️ <strong>Mock data</strong> — meters are currently hardcoded.
                        Replace with real API calls once <code className="bg-blue-100 px-1 rounded">GET /api/meters</code> is ready.
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <p className="text-gray-400">Loading meters...</p>
                    </div>
                ) : meters.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white">
                        <EmptyState icon="⚡" message="No meters added yet" sub="Click 'Add Meter' to assign a meter to a tenant." />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {meters.map((meter) => (
                            <MeterCard key={meter._id} meter={meter} />
                        ))}
                    </div>
                )}
            </main>

            <AddMeterModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onMeterAdded={handleMeterAdded}
                activeTenants={activeTenants}
            />
        </div>
    );
}

export default Meters;
