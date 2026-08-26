function Meter({ meterNumber, currentReading, previousReading }) {
    const usage = currentReading - previousReading;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm w-full">
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">Your Meter</p>
                    <h2 className="text-lg font-bold text-gray-800">#{meterNumber}</h2>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-xs text-blue-500 mb-1 font-medium">Current Reading</p>
                    <p className="text-3xl font-bold text-blue-700">{currentReading}</p>
                    <p className="text-xs text-blue-400 mt-1">kWh</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-xs text-gray-400 mb-1 font-medium">Previous Reading</p>
                    <p className="text-3xl font-bold text-gray-600">{previousReading}</p>
                    <p className="text-xs text-gray-400 mt-1">kWh</p>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                <p className="text-sm text-blue-600 font-medium">Usage this period</p>
                <p className="text-lg font-bold text-blue-700">{usage} kWh</p>
            </div>
        </div>
    );
}

export default Meter;