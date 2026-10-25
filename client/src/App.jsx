import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import Admin from "./pages/Admin/Admin";
import Tenants from "./pages/Tenants/Tenants";
import Meters from "./pages/Meters/Meters";
import Transactions from "./pages/Transactions/Transactions";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default → redirect to login */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/* Public */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Tenant */}
                <Route path="/home" element={<Home />} />

                {/* Admin */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/tenants" element={<Tenants />} />
                <Route path="/meters" element={<Meters />} />
                <Route path="/transactions" element={<Transactions />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;