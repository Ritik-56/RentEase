import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Meter from "../../components/Meter";
import EmptyState from "../../components/EmptyState";
import { getUser } from "../../utils/auth";

const MOCK_MY_METER = {
    _id: "mock_meter_1",
    meterNumber: "MT-1001",
    currentReading: 1284,
    previousReading: 1150,
};

function Home() {
    const user = getUser();
    const [meter, setMeter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: replace mock with real fetch when GET /api/meters/my is ready
        setMeter(MOCK_MY_METER);
        setLoading(false);
    }, []);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {greeting}, {user?.name || "Tenant"} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s your meter usage overview.</p>
                </div>

                {user?.status === "Pending" && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-start gap-3">
                        <span className="text-yellow-500 text-lg mt-0.5">⏳</span>
                        <div>
                            <p className="text-sm font-medium text-yellow-800">Account Pending Approval</p>
                            <p className="text-xs text-yellow-600 mt-0.5">
                                Your registration is being reviewed by the admin. You&apos;ll be notified once approved.
                            </p>
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Meter Information</h2>

                    {loading ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                            <p className="text-gray-400 text-sm">Loading meter data...</p>
                        </div>
                    ) : meter ? (
                        <Meter
                            meterNumber={meter.meterNumber}
                            currentReading={meter.currentReading}
                            previousReading={meter.previousReading}
                        />
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-white">
                            <EmptyState
                                icon="⚡"
                                message="No meter assigned yet"
                                sub="Your meter will appear here once the admin assigns one to your account."
                            />
                        </div>
                    )}
                </div>

                {meter && (
                    <p className="text-xs text-gray-400 text-center mt-4">
                        ⚠️ Meter data is currently mocked — replace when{" "}
                        <code className="bg-gray-100 px-1 rounded">GET /api/meters/my</code> is ready.
                    </p>
                )}
            </main>
        </div>
    );
}

export default Home;