const RATE_PER_UNIT = 10; // ₹ per kWh

function MeterCard({ meter, onEdit }) {
    const units = Math.max(0, meter.currentReading - meter.previousReading);
    const amountDue = units * RATE_PER_UNIT;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
            {/* Header: meter info + Edit button */}
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                        Meter #{meter.meterNumber}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                        {meter.tenantName ?? meter.userId?.name ?? "Unknown Tenant"}
                    </p>
                    {(meter.tenantEmail || meter.userId?.email) && (
                        <p className="text-xs text-gray-400 truncate">
                            {meter.tenantEmail ?? meter.userId?.email}
                        </p>
                    )}
                </div>
                <button
                    id={`edit-meter-${meter._id}`}
                    onClick={() => onEdit(meter)}
                    className="flex-shrink-0 flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                    ✏️ Edit
                </button>
            </div>

            {/* Readings grid */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Previous</p>
                    <p className="text-xl font-bold text-gray-700">
                        {meter.previousReading}
                        <span className="text-xs font-normal text-gray-400 ml-1">kWh</span>
                    </p>
                </div>
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                    <p className="text-xs text-blue-600 mb-1">Current</p>
                    <p className="text-xl font-bold text-blue-700">
                        {meter.currentReading}
                        <span className="text-xs font-normal text-blue-400 ml-1">kWh</span>
                    </p>
                </div>
            </div>

            {/* Usage and amount due */}
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-3 flex items-center justify-between gap-2">
                <div>
                    <p className="text-xs text-amber-600 font-medium">Units Used</p>
                    <p className="text-lg font-bold text-amber-700">{units} kWh</p>
                </div>
                <div className="h-8 w-px bg-amber-200 flex-shrink-0" />
                <div className="text-right">
                    <p className="text-xs text-amber-600 font-medium">Amount Due</p>
                    <p className="text-lg font-bold text-amber-700">₹{amountDue}</p>
                </div>
            </div>

            {/* Rate note */}
            <p className="text-xs text-gray-400 text-center -mt-2">
                {units} kWh × ₹{RATE_PER_UNIT}/unit = ₹{amountDue}
            </p>
        </div>
    );
}

export default MeterCard;
