
// Billing constants
const FIXED_RENT = 5000;       // ₹ per month
const ELECTRICITY_RATE = 10;   // ₹ per kWh

function TenantCard({ tenant, onAccept, loading = false, waterCharge = 400 }) {
    // Bill calculation (only for active tenants with a meter)
    const hasMeter = tenant.status === "Active" && tenant.meterNumber;
    const units = hasMeter
        ? Math.max(0, (tenant.currentReading ?? 0) - (tenant.previousReading ?? 0))
        : 0;
    const electricityCharge = units * ELECTRICITY_RATE;
    const totalBill = FIXED_RENT + waterCharge + electricityCharge;
    const handleclick = (phone, message) => {
        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        window.open(url, "_blank");
    };

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            {/* Header: avatar + name + status badge */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                            {tenant.name ? tenant.name[0].toUpperCase() : "?"}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-gray-800 leading-tight truncate">{tenant.name || "Unknown"}</h2>
                        <p className="text-xs text-gray-500 truncate">{tenant.email}</p>
                    </div>
                </div>
                <span className={`flex-shrink-0 ml-2 px-2.5 py-1 text-xs font-medium rounded-full ${tenant.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                    {tenant.status}
                </span>
            </div>

            {/* Info rows */}
            <div className="space-y-1.5 text-sm text-gray-600">
                {tenant.phone && (
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-28 flex-shrink-0">Phone</span>
                        <span className="font-medium text-gray-700 truncate">{tenant.phone}</span>
                    </div>
                )}
                {tenant.maritalStatus && (
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-28 flex-shrink-0">Marital Status</span>
                        <span className="font-medium text-gray-700">{tenant.maritalStatus}</span>
                    </div>
                )}
                <div className="flex gap-2">
                    <span className="text-gray-400 w-28 flex-shrink-0">Family Members</span>
                    <span className="font-medium text-gray-700">{tenant.familyMembersCount ?? "—"}</span>
                </div>
                {tenant.permanentAddress && (
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-28 flex-shrink-0">Address</span>
                        <span className="font-medium text-gray-700 truncate">{tenant.permanentAddress}</span>
                    </div>
                )}
            </div>

            {/* Accept button for pending tenants */}
            {tenant.status === "Pending" && (
                <button
                    id={`accept-tenant-${tenant._id}`}
                    onClick={() => onAccept(tenant._id)}
                    disabled={loading}
                    className="w-full mt-4 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                    {loading ? "Accepting..." : "Accept Tenant"}
                </button>
            )}

            {/* Meter + full bill breakdown for active tenants */}
            {tenant.status === "Active" && (
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-3">
                    {/* Meter badge */}
                    <div>
                        <p className="text-xs text-gray-400 mb-1.5">Assigned Meter</p>
                        {tenant.meterNumber ? (
                            <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2">
                                <span className="text-base">⚡</span>
                                <span className="text-sm font-semibold text-blue-700">{tenant.meterNumber}</span>
                                {hasMeter && (
                                    <span className="ml-auto text-xs text-blue-500">{units} kWh used</span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 rounded-lg bg-gray-50 border border-dashed border-gray-200 px-3 py-2">
                                <span className="text-base">➕</span>
                                <span className="text-sm text-gray-400">No meter assigned yet</span>
                            </div>
                        )}
                    </div>

                    {/* Bill breakdown — only if meter is assigned */}
                    {hasMeter && (
                        <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 pt-3 pb-2">
                                Monthly Bill
                            </p>

                            {/* Line items */}
                            <div className="px-3 space-y-1.5 pb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">🏠 Fixed Rent</span>
                                    <span className="font-medium text-gray-700">₹{FIXED_RENT.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">💧 Water Charge</span>
                                    <span className="font-medium text-gray-700">₹{waterCharge.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <div>
                                        <span className="text-gray-500">⚡ Electricity</span>
                                        <span className="text-xs text-gray-400 ml-1">({units} × ₹{ELECTRICITY_RATE})</span>
                                    </div>
                                    <span className="font-medium text-gray-700">₹{electricityCharge.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center bg-blue-600 px-3 py-2.5">
                                <span className="text-sm font-semibold text-blue-100">Total Due</span>
                                <span className="text-base font-bold text-white">₹{totalBill.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Send Message button */}
                    {hasMeter && (
                        <button
                            id={`send-message-${tenant._id}`}
                            onClick={()=>handleclick(
                                9098930279,
                                `Hello ${tenant.name} 👋🏻 

Your RentEase payment for August is:

💰 Rent:5000
🌊 Water:${waterCharge}
⚡ Electricity:${units}

Pay here:
Upi:  upi://pay?pa=9098930279@ybl&pn=Ritik%20Patil&am=${totalBill}&cu=INR

Thankyou,
RentEase`
                            )}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                            <span>✉️</span>
                            Send Message
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default TenantCard;