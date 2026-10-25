import User from '../models/User.js'
import TenantProfile from '../models/TenantProfile.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
    const { identifier, password } = req.body;

    const user = await User.findOne({
        $or: [{ email: identifier }, { phone: identifier }]
    });

    if (!user) return res.status(401).json({ message: "Invalid Username" });

    const isPassCorrect = await bcrypt.compare(password,user.password);

    if (!isPassCorrect) return res.status(401).json({ message: "Invalid Password" });

    const token = jwt.sign({
        userId: user._id,
        role: user.role
    },
    process.env.JWT_SECRET,{
        expiresIn:'1d'
    }
);

    return res.json({ message: "Login Successfull", role: user.role, _id: user._id, name: user.name,token });
};

const register = async (req, res) => {
    const { name, email, phone, password, permanentAddress, governmentId, maritalStatus, familyMembersCount } = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const user = new User({ name, email, phone, password:hashedPassword, role: 'Tenant' });
    await user.save();

    const tenantProfile = new TenantProfile({ userId: user._id, permanentAddress, governmentId, maritalStatus, familyMembersCount });
    await tenantProfile.save();

    res.json({ message: "User Registered Successfully" });
};

export default { login, register };