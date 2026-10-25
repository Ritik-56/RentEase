import { useEffect, useState, useCallback } from "react";
import Navbar from "../../components/Navbar";
import EmptyState from "../../components/EmptyState";
import { getUser } from "../../utils/auth";

// Billing constants
const FIXED_RENT = 5000;
const ELECTRICITY_RATE = 10;

const POLL_INTERVAL = 10000; // refresh meter data every 10s

function Home() {
    const user = getUser();
    const [meter, setMeter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [waterCharge, setWaterCharge] = useState(400);

    // Fetch water charge from settings
    useEffect(() => {
        fetch("http://localhost:5000/api/settings")
            .then((r) => r.json())
            .then((data) => { if (data.waterCharge !== undefined) setWaterCharge(data.waterCharge); })
            .catch(() => {});
    }, []);

    const fetchMeter = useCallback((silent = false) => {
        if (!user?._id) {
            setLoading(false);
            return;
        }
        if (!silent) setLoading(true);
        fetch(`http://localhost:5000/api/meters/user/${user._id}`)
            .then((r) => r.json())
            .then((data) => {
                setMeter(data);   // null means no meter assigned yet
                setError("");
            })
            .catch(() => setError("Failed to load meter data. Is the server running?"))
            .finally(() => { if (!silent) setLoading(false); });
    }, [user?._id]);

    useEffect(() => {
        fetchMeter(false);
        const interval = setInterval(() => fetchMeter(true), POLL_INTERVAL);
        return () => clearInterval(interval);
    }, [fetchMeter]);

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    // Bill calculations
    const units = meter ? Math.max(0, (meter.currentReading ?? 0) - (meter.previousReading ?? 0)) : 0;
    const electricityCharge = units * ELECTRICITY_RATE;
    const totalBill = FIXED_RENT + waterCharge + electricityCharge;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Greeting */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {greeting}, {user?.name || "Tenant"} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Here&apos;s your meter usage and bill overview.</p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                {!user?._id && (
                    <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 flex items-start gap-3">
                        <span className="text-yellow-500 text-lg mt-0.5">⚠️</span>
                        <div>
                            <p className="text-sm font-medium text-yellow-800">Session issue</p>
                            <p className="text-xs text-yellow-600 mt-0.5">Please log out and log in again to refresh your session.</p>
                        </div>
                    </div>
                )}

                {/* Meter information */}
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Meter Information</h2>

                {loading ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
                        <p className="text-gray-400 text-sm">Loading meter data...</p>
                    </div>
                ) : !meter ? (
                    <div className="rounded-xl border border-gray-200 bg-white">
                        <EmptyState
                            icon="⚡"
                            message="No meter assigned yet"
                            sub="Your meter will appear here once the admin assigns one to your account."
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Meter card */}
                        <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Your Meter</p>
                                    <h2 className="text-lg font-bold text-gray-800">#{meter.meterNumber}</h2>
                                </div>
                                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
                            </div>

                            {/* Readings */}
                            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                                <div className="rounded-lg bg-blue-50 p-4">
                                    <p className="text-xs text-blue-500 mb-1 font-medium">Current Reading</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-blue-700">{meter.currentReading}</p>
                                    <p className="text-xs text-blue-400 mt-1">kWh</p>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <p className="text-xs text-gray-400 mb-1 font-medium">Previous Reading</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-600">{meter.previousReading}</p>
                                    <p className="text-xs text-gray-400 mt-1">kWh</p>
                                </div>
                            </div>

                            {/* Usage bar */}
                            <div className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                                <p className="text-sm text-amber-600 font-medium">⚡ Units Used This Period</p>
                                <p className="text-lg font-bold text-amber-700">{units} kWh</p>
                            </div>
                        </div>

                        {/* Monthly Bill breakdown */}
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-5 sm:px-6 pt-5 pb-4">
                                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                    Monthly Bill Breakdown
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">🏠</span>
                                            <span className="text-gray-600">Fixed Rent</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">₹{FIXED_RENT.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">💧</span>
                                            <span className="text-gray-600">Water Charge</span>
                                        </div>
                                        <span className="font-semibold text-gray-800">₹{waterCharge.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">⚡</span>
                                            <div>
                                                <span className="text-gray-600">Electricity</span>
                                                <p className="text-xs text-gray-400">{units} kWh × ₹{ELECTRICITY_RATE}/unit</p>
                                            </div>
                                        </div>
                                        <span className="font-semibold text-gray-800">₹{electricityCharge.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Total row */}
                            <div className="flex justify-between items-center bg-blue-600 px-5 sm:px-6 py-4">
                                <div>
                                    <p className="text-sm font-semibold text-blue-100">Total Amount Due</p>
                                    <p className="text-xs text-blue-300 mt-0.5">This month</p>
                                </div>
                                <p className="text-2xl font-bold text-white">₹{totalBill.toLocaleString()}</p>
                            </div>

                            {/* Send Message button */}
                            <div className="px-5 sm:px-6 py-4">
                                <button
                                    id="home-send-message-btn"
                                    className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                                >
                                    <span>✉️</span>
                                    Send Message to Admin
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Home;