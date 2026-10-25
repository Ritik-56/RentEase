import Settings from "../models/Settings.js";

const DEFAULT_WATER_CHARGE = 400;

// GET /api/settings — return all settings (waterCharge etc.)
const getSettings = async (req, res) => {
    try {
        const waterChargeSetting = await Settings.findOne({ key: "waterCharge" });
        return res.json({
            waterCharge: waterChargeSetting ? waterChargeSetting.value : DEFAULT_WATER_CHARGE,
        });
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch settings", error: err.message });
    }
};

// PATCH /api/settings/water-charge — admin updates the water charge
const updateWaterCharge = async (req, res) => {
    try {
        const { waterCharge } = req.body;
        const value = Number(waterCharge);

        if (isNaN(value) || value < 0) {
            return res.status(400).json({ message: "waterCharge must be a non-negative number." });
        }

        // Upsert: create if doesn't exist, update if it does
        await Settings.findOneAndUpdate(
            { key: "waterCharge" },
            { value },
            { upsert: true, new: true }
        );

        return res.json({ waterCharge: value });
    } catch (err) {
        return res.status(500).json({ message: "Failed to update water charge", error: err.message });
    }
};

export default { getSettings, updateWaterCharge };
