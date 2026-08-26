import User from '../models/User.js'
import TenantProfile from '../models/TenantProfile.js';

const login = async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) return res.status(401).json({ message: "Invalid Username" });
    if (password !== user.password) return res.status(401).json({ message: "Invalid Password" });

    return res.json({ message: "Login Successfull", role: user.role });
};

const register = async (req, res) => {
    const { name, email, phone, password, permanentAddress, governmentId, maritalStatus, familyMembersCount } = req.body;

    const user = new User({ name, email, phone, password, role: 'Tenant' });
    await user.save();

    const tenantProfile = new TenantProfile({ userId: user._id, permanentAddress, governmentId, maritalStatus, familyMembersCount });
    await tenantProfile.save();

    res.json({ message: "User Registered Successfully" });
};

export default { login, register };