import mongoose from "mongoose";

const SettingsSchema = mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const Settings = mongoose.model("Settings", SettingsSchema);

export default Settings;
