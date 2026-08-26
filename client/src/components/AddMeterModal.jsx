import { useState } from "react";

function AddMeterModal({ isOpen, onClose, onMeterAdded, activeTenants = [] }) {
    const [userId, setUserId] = useState("");
    const [meterNumber, setMeterNumber] = useState("");
    const [currentReading, setCurrentReading] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!userId || !meterNumber || currentReading === "") {
            setError("All fields are required.");
            return;
        }

        setLoading(true);

        // TODO: replace mock with real POST /api/meters when backend route exists
        console.log("MOCK addMeter:", { userId, meterNumber, currentReading });
        const newMeter = {
            _id: `mock_meter_${Date.now()}`,
            userId,
            meterNumber,
            currentReading: Number(currentReading),
            previousReading: 0,
        };

        setLoading(false);
        onMeterAdded(newMeter);
        setUserId("");
        setMeterNumber("");
        setCurrentReading("");
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-800">Add New Meter</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none" aria-label="Close modal">×</button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Tenant</label>
                        <select
                            id="add-meter-tenant"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none"
                        >
                            <option value="">Select a tenant...</option>
                            {activeTenants.map((t) => (
                                <option key={t._id} value={t._id}>{t.name} ({t.email})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Meter Number</label>
                        <input
                            id="add-meter-number"
                            type="text"
                            value={meterNumber}
                            onChange={(e) => setMeterNumber(e.target.value)}
                            placeholder="e.g. MT-1004"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Reading (kWh)</label>
                        <input
                            id="add-meter-reading"
                            type="number"
                            min="0"
                            value={currentReading}
                            onChange={(e) => setCurrentReading(e.target.value)}
                            placeholder="e.g. 0"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
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
