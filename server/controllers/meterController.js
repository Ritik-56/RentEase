import Meter from "../models/Meter.js";
import TenantProfile from "../models/TenantProfile.js";

// GET /api/meters  — return all meters with user info populated
const getMeters = async (req, res) => {
    try {
        const meters = await Meter.find({}).populate("userId", "name email phone");

        const result = meters.map((m) => ({
            _id: m._id,
            meterNumber: m.meterNumber,
            currentReading: m.currentReading,
            previousReading: m.previousReading,
            tenantId: m.userId?._id,
            tenantName: m.userId?.name || "Unknown",
            tenantEmail: m.userId?.email || "",
        }));

        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch meters", error: err.message });
    }
};

// POST /api/meters  — add a new meter
const addMeter = async (req, res) => {
    try {
        const { userId, meterNumber, previousReading, currentReading } = req.body;

        if (!userId || !meterNumber) {
            return res.status(400).json({ message: "userId and meterNumber are required." });
        }

        const existing = await Meter.findOne({ userId });
        if (existing) {
            return res.status(409).json({ message: "This tenant already has a meter assigned." });
        }

        const meter = new Meter({
            userId,
            meterNumber,
            previousReading: Number(previousReading) || 0,
            currentReading: Number(currentReading) || 0,
        });

        await meter.save();
        await meter.populate("userId", "name email phone");

        // ✅ Write meterNumber back to TenantProfile so Tenants tab stays in sync
        await TenantProfile.findOneAndUpdate(
            { userId },
            { meterNumber }
        );

        return res.status(201).json({
            _id: meter._id,
            meterNumber: meter.meterNumber,
            currentReading: meter.currentReading,
            previousReading: meter.previousReading,
            tenantId: meter.userId?._id,
            tenantName: meter.userId?.name || "Unknown",
            tenantEmail: meter.userId?.email || "",
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to add meter", error: err.message });
    }
};

// PATCH /api/meters/:meterId  — update current reading (moves old current → previous)
const updateMeterReading = async (req, res) => {
    try {
        const { meterId } = req.params;
        const { currentReading } = req.body;

        if (currentReading === undefined || currentReading === "") {
            return res.status(400).json({ message: "currentReading is required." });
        }

        const meter = await Meter.findById(meterId);
        if (!meter) return res.status(404).json({ message: "Meter not found." });

        // Shift: old current becomes new previous
        meter.previousReading = meter.currentReading;
        meter.currentReading = Number(currentReading);
        await meter.save();
        await meter.populate("userId", "name email phone");

        return res.json({
            _id: meter._id,
            meterNumber: meter.meterNumber,
            currentReading: meter.currentReading,
            previousReading: meter.previousReading,
            tenantId: meter.userId?._id,
            tenantName: meter.userId?.name || "Unknown",
            tenantEmail: meter.userId?.email || "",
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update meter", error: err.message });
    }
};

// GET /api/meters/user/:userId  — fetch the meter for a specific tenant (used on Home page)
const getMeterByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const meter = await Meter.findOne({ userId }).populate("userId", "name email");

        if (!meter) {
            return res.json(null); // no meter yet — not an error
        }

        return res.json({
            _id: meter._id,
            meterNumber: meter.meterNumber,
            currentReading: meter.currentReading,
            previousReading: meter.previousReading,
            tenantName: meter.userId?.name || "Unknown",
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch meter", error: err.message });
    }
};

export default { getMeters, addMeter, updateMeterReading, getMeterByUserId };
