import { useState, useEffect } from "react";

function EditMeterModal({ isOpen, onClose, meter, onMeterUpdated }) {
    const [currentReading, setCurrentReading] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (meter) {
            setCurrentReading("");
            setError("");
        }
    }, [meter]);

    if (!isOpen || !meter) return null;

    const units = currentReading !== ""
        ? Math.max(0, Number(currentReading) - meter.currentReading)
        : null;

    const handleClose = () => {
        setCurrentReading("");
        setError("");
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (currentReading === "") {
            setError("New reading is required.");
            return;
        }

        if (Number(currentReading) < meter.currentReading) {
            setError(`New reading must be ≥ current reading (${meter.currentReading} kWh).`);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`http://localhost:5000/api/meters/${meter._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentReading: Number(currentReading) }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Failed to update reading.");
                setLoading(false);
                return;
            }

            onMeterUpdated(data);
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
                        <h2 className="text-lg font-semibold text-gray-800">Update Reading</h2>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Meter #{meter.meterNumber} · {meter.tenantName}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                        aria-label="Close edit modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Current snapshot */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3">
                            <p className="text-xs text-gray-500 mb-1">Previous Reading</p>
                            <p className="text-lg font-bold text-gray-700">
                                {meter.previousReading}
                                <span className="text-xs font-normal text-gray-400 ml-1">kWh</span>
                            </p>
                        </div>
                        <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                            <p className="text-xs text-blue-600 mb-1">Current Reading</p>
                            <p className="text-lg font-bold text-blue-700">
                                {meter.currentReading}
                                <span className="text-xs font-normal text-blue-400 ml-1">kWh</span>
                            </p>
                        </div>
                    </div>

                    {/* New reading input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Current Reading
                            <span className="text-gray-400 font-normal ml-1">(kWh)</span>
                        </label>
                        <input
                            id="edit-meter-reading"
                            type="number"
                            min={meter.currentReading}
                            value={currentReading}
                            onChange={(e) => setCurrentReading(e.target.value)}
                            placeholder={`Must be ≥ ${meter.currentReading}`}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                            autoFocus
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            The current reading ({meter.currentReading} kWh) will become the new previous reading.
                        </p>
                    </div>

                    {/* Live amount preview */}
                    {units !== null && (
                        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-amber-600 font-medium">Units This Period</p>
                                <p className="text-xl font-bold text-amber-700">{units} kWh</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-amber-600 font-medium">Amount Due</p>
                                <p className="text-xl font-bold text-amber-700">₹{units * 10}</p>
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
                            id="edit-meter-submit"
                            disabled={loading}
                            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Reading"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditMeterModal;
