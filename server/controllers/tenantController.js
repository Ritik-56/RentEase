import TenantProfile from "../models/TenantProfile.js";

const acceptTenant = async (req, res) => {
    const tenantId = req.params.tenantId;

    const tenant = await TenantProfile.findByIdAndUpdate(
        tenantId,
        { status: "Active" },
        { new: true }
    );

    if (!tenant) {
        return res.status(404).json({
            message: "Tenant not found"
        });
    }

    return res.json({
        message: "Tenant accepted successfully",
        tenant
    });
};



export default acceptTenant;