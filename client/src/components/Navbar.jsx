import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, clearUser } from "../utils/auth";

function Navbar() {
    const navigate = useNavigate();
    const user = getUser();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        clearUser();
        navigate("/login");
    };

    const isAdmin = user?.role === "Admin";

    return (
        <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                <Link to={isAdmin ? "/admin" : "/home"} className="text-xl font-bold text-blue-600 tracking-tight">
                    RentEase
                </Link>

                {/* Desktop nav links */}
                <div className="hidden sm:flex items-center gap-1">
                    {isAdmin ? (
                        <>
                            <Link to="/admin" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Dashboard</Link>
                            <Link to="/tenants" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Tenants</Link>
                            <Link to="/meters" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Meters</Link>
                        </>
                    ) : (
                        <Link to="/home" className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Home</Link>
                    )}
                </div>

                {/* User info + logout (desktop) */}
                <div className="hidden sm:flex items-center gap-3">
                    {user && (
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-semibold text-blue-600">
                                    {user.name ? user.name[0].toUpperCase() : "?"}
                                </span>
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium text-gray-800 leading-tight">{user.name || "User"}</p>
                                <p className="text-xs text-gray-400 leading-tight">{user.role}</p>
                            </div>
                        </div>
                    )}
                    <button
                        id="navbar-logout-btn"
                        onClick={handleLogout}
                        className="ml-2 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Mobile hamburger */}
                <button
                    id="navbar-hamburger"
                    className="sm:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    onClick={() => setMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    <div className="space-y-1.5">
                        <span className={`block h-0.5 w-5 bg-gray-600 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
                        <span className={`block h-0.5 w-5 bg-gray-600 transition-all ${menuOpen ? "opacity-0" : ""}`} />
                        <span className={`block h-0.5 w-5 bg-gray-600 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                    </div>
                </button>
            </div>

            {/* Mobile dropdown menu */}
            {menuOpen && (
                <div className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
                    {isAdmin ? (
                        <>
                            <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Dashboard</Link>
                            <Link to="/tenants" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Tenants</Link>
                            <Link to="/meters" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Meters</Link>
                        </>
                    ) : (
                        <Link to="/home" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">Home</Link>
                    )}
                    <div className="pt-2 border-t border-gray-100 mt-2">
                        {user && (
                            <p className="text-xs text-gray-400 px-3 mb-2">
                                Logged in as <span className="font-medium text-gray-600">{user.name || "User"}</span> ({user.role})
                            </p>
                        )}
                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;