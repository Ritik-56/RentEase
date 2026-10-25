import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        permanentAddress: "",
        governmentId: "",
        maritalStatus: "",
        familyMembersCount: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, familyMembersCount: Number(form.familyMembersCount) }),
        });
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            navigate("/login");
        } else {
            setError(data?.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-1">RentEase</h1>
                    <p className="text-gray-500 text-sm">Create your tenant account</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 sm:px-8 py-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Tenant Registration</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Details</p>

                        <div>
                            <label htmlFor="reg-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                id="reg-name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ravi Kumar"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                            <div>
                                <label htmlFor="reg-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    id="reg-phone"
                                    name="phone"
                                    type="text"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider pt-2">Tenant Profile</p>

                        <div>
                            <label htmlFor="reg-address" className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                            <input
                                id="reg-address"
                                name="permanentAddress"
                                type="text"
                                value={form.permanentAddress}
                                onChange={handleChange}
                                placeholder="123 Main St, City, State"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-govtid" className="block text-sm font-medium text-gray-700 mb-1">Government ID (PAN / Aadhaar)</label>
                            <input
                                id="reg-govtid"
                                name="governmentId"
                                type="text"
                                value={form.governmentId}
                                onChange={handleChange}
                                placeholder="Enter PAN or Aadhaar number"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="reg-marital" className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select
                                    id="reg-marital"
                                    name="maritalStatus"
                                    value={form.maritalStatus}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">Select...</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="reg-family" className="block text-sm font-medium text-gray-700 mb-1">Family Members</label>
                                <input
                                    id="reg-family"
                                    name="familyMembersCount"
                                    type="number"
                                    min="1"
                                    value={form.familyMembersCount}
                                    onChange={handleChange}
                                    placeholder="e.g. 3"
                                    required
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            id="register-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;