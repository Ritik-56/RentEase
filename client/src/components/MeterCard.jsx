function MeterCard({ meter }) {
    const usage = meter.currentReading - meter.previousReading;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-800">Meter #{meter.meterNumber}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{meter.userId?.name ?? "Unknown Tenant"}</p>
                    {meter.userId?.email && <p className="text-xs text-gray-400">{meter.userId.email}</p>}
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Current Reading</p>
                    <p className="text-xl font-bold text-gray-900">
                        {meter.currentReading}<span className="text-xs font-normal text-gray-500 ml-1">kWh</span>
                    </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs text-gray-500 mb-1">Previous Reading</p>
                    <p className="text-xl font-bold text-gray-700">
                        {meter.previousReading}<span className="text-xs font-normal text-gray-500 ml-1">kWh</span>
                    </p>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-3 py-2">
                <p className="text-xs text-blue-600 font-medium">Usage this period</p>
                <p className="text-sm font-bold text-blue-700">{usage} kWh</p>
            </div>
        </div>
    );
}

export default MeterCard;
