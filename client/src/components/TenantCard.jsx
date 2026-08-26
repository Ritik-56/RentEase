function TenantCard({ tenant, onAccept, loading = false }) {
    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                            {tenant.name ? tenant.name[0].toUpperCase() : "?"}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 leading-tight">{tenant.name || "Unknown"}</h2>
                        <p className="text-xs text-gray-500">{tenant.email}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${tenant.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {tenant.status}
                </span>
            </div>

            <div className="space-y-1.5 text-sm text-gray-600">
                {tenant.phone && (
                    <div className="flex gap-2">
                        <span className="text-gray-400 w-28 flex-shrink-0">Phone</span>
                        <span className="font-medium text-gray-700">{tenant.phone}</span>
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
                        <span className="font-medium text-gray-700">{tenant.permanentAddress}</span>
                    </div>
                )}
            </div>

            {tenant.status === "Pending" && (
                <button
                    id={`accept-tenant-${tenant._id}`}
                    onClick={() => onAccept(tenant._id)}
                    disabled={loading}
                    className="w-full mt-5 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                    {loading ? "Accepting..." : "Accept Tenant"}
                </button>
            )}

            {tenant.status === "Active" && (
                <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400 mb-0.5">Assigned Meter</p>
                    <p className="text-sm font-semibold text-gray-800">
                        {tenant.meterNumber || <span className="text-gray-400 font-normal">No meter assigned yet</span>}
                    </p>
                </div>
            )}
        </div>
    );
}

export default TenantCard;