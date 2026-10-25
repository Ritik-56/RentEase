import TenantProfile from "../models/TenantProfile.js";
import Meter from "../models/Meter.js";

// Build map: userId (string) → { meterNumber, currentReading, previousReading }
const buildMeterMap = async () => {
    const meters = await Meter.find({}, "userId meterNumber currentReading previousReading");
    const map = {};
    meters.forEach((m) => {
        map[m.userId.toString()] = {
            meterNumber: m.meterNumber,
            currentReading: m.currentReading ?? 0,
            previousReading: m.previousReading ?? 0,
        };
    });
    return map;
};

const formatTenant = (t, meterInfo = {}) => ({
    _id: t._id,
    userId: t.userId?._id?.toString(),
    name: t.userId?.name || "Unknown",
    email: t.userId?.email || "",
    phone: t.userId?.phone || "",
    maritalStatus: t.maritalStatus,
    permanentAddress: t.permanentAddress,
    governmentId: t.governmentId,
    familyMembersCount: t.familyMembersCount,
    status: t.status || "Pending",
    // Meter data — populated for bill calculation on TenantCard
    meterNumber: t.meterNumber || meterInfo.meterNumber || null,
    currentReading: meterInfo.currentReading ?? null,
    previousReading: meterInfo.previousReading ?? null,
});

const getTenants = async (req, res) => {
    try {
        const [tenants, meterMap] = await Promise.all([
            TenantProfile.find({}).populate("userId", "name email phone"),
            buildMeterMap(),
        ]);

        const result = tenants.map((t) => {
            const userId = t.userId?._id?.toString();
            return formatTenant(t, meterMap[userId] || {});
        });

        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch tenants", error: err.message });
    }
};

const acceptTenant = async (req, res) => {
    try {
        const tenantId = req.params.tenantId;

        const tenant = await TenantProfile.findByIdAndUpdate(
            tenantId,
            { status: "Active" },
            { new: true }
        ).populate("userId", "name email phone");

        if (!tenant) {
            return res.status(404).json({ message: "Tenant not found" });
        }

        const meterMap = await buildMeterMap();
        const userId = tenant.userId?._id?.toString();

        return res.json({
            message: "Tenant accepted successfully",
            tenant: formatTenant(tenant, meterMap[userId] || {}),
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to accept tenant", error: err.message });
    }
};

export default { getTenants, acceptTenant };