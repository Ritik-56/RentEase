import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../../utils/auth";

function Login() {
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ identifier, password }),
        });
        const data = await response.json();
        setLoading(false);

        if (response.ok) {
            setUser({
             _id: data._id ?? null,
             name: data.name ?? identifier,
              role: data.role
             });
            if (data.role === "Tenant") navigate("/home");
            else if (data.role === "Admin") navigate("/admin");
        } else {
            setError(data?.message || "Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-1">RentEase</h1>
                    <p className="text-gray-500 text-sm">Property &amp; rental management made simple</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 sm:px-8 py-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in to your account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="login-identifier" className="block text-sm font-medium text-gray-700 mb-1">
                                Email or Phone
                            </label>
                            <input
                                id="login-identifier"
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                placeholder="you@example.com or 9876543210"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        {error && (
                            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            id="login-submit-btn"
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-medium hover:underline">
                            Register as Tenant
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;