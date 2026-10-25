import { useState } from "react";

function AddMeterModal({ isOpen, onClose, onMeterAdded, activeTenants = [] }) {
    const [tenantId, setTenantId] = useState("");
    const [meterNumber, setMeterNumber] = useState("");
    const [previousReading, setPreviousReading] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleClose = () => {
        setTenantId("");
        setMeterNumber("");
        setPreviousReading("");
        setCurrentReading("");
        setError("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!tenantId || !meterNumber || previousReading === "" || currentReading === "") {
            setError("All fields are required.");
            return;
        }

        if (Number(currentReading) < Number(previousReading)) {
            setError("Current reading cannot be less than previous reading.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/meters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: tenantId,
                    meterNumber,
                    previousReading: Number(previousReading),
                    currentReading: Number(currentReading),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to add meter.");
                setLoading(false);
                return;
            }

            onMeterAdded(data);
            handleClose();
        } catch {
            setError("Could not connect to server. Is it running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Add New Meter</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Assign a meter to an active tenant</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Tenant selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign to Tenant
                        </label>
                        <select
                            id="add-meter-tenant"
                            value={tenantId}
                            onChange={(e) => setTenantId(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none bg-white"
                        >
                            <option value="">Select a tenant...</option>
                            {activeTenants.length === 0 ? (
                                <option disabled>
                                    All active tenants already have meters assigned
                                </option>
                            ) : (
                                activeTenants.map((t) => (
                                    <option key={t._id} value={t.userId || t._id}>
                                        {t.name} ({t.email})
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    {/* Meter number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meter Number
                        </label>
                        <input
                            id="add-meter-number"
                            type="text"
                            value={meterNumber}
                            onChange={(e) => setMeterNumber(e.target.value)}
                            placeholder="e.g. MT-1004"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Previous & Current reading side by side */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Previous Reading
                                <span className="text-gray-400 font-normal ml-1">(kWh)</span>
                            </label>
                            <input
                                id="add-meter-prev-reading"
                                type="number"
                                min="0"
                                value={previousReading}
                                onChange={(e) => setPreviousReading(e.target.value)}
                                placeholder="e.g. 0"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Reading
                                <span className="text-gray-400 font-normal ml-1">(kWh)</span>
                            </label>
                            <input
                                id="add-meter-curr-reading"
                                type="number"
                                min="0"
                                value={currentReading}
                                onChange={(e) => setCurrentReading(e.target.value)}
                                placeholder="e.g. 100"
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Live preview of units + amount */}
                    {previousReading !== "" && currentReading !== "" && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-amber-600 font-medium">Units Used</p>
                                <p className="text-lg font-bold text-amber-700">
                                    {Math.max(0, Number(currentReading) - Number(previousReading))} kWh
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-amber-600 font-medium">Amount Due</p>
                                <p className="text-lg font-bold text-amber-700">
                                    ₹{Math.max(0, (Number(currentReading) - Number(previousReading)) * 10)}
                                </p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
                    )}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            id="add-meter-submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? "Adding..." : "Add Meter"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMeterModal;
