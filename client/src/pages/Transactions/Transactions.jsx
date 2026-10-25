import { useState } from "react";
import Navbar from "../../components/Navbar";

// ── Mock data for UI demonstration ──────────────────────────────────────────
const MOCK_TRANSACTIONS = [
    { _id: "t1", tenantName: "Ravi Kumar",   amount: 6150, status: "Paid",    date: "2026-08-01", type: "Monthly Rent", meterNumber: "MT-1001" },
    { _id: "t2", tenantName: "Priya Sharma", amount: 5820, status: "Paid",    date: "2026-08-03", type: "Monthly Rent", meterNumber: "MT-1002" },
    { _id: "t3", tenantName: "Arjun Mehta",  amount: 6400, status: "Pending", date: "2026-08-05", type: "Monthly Rent", meterNumber: "MT-1003" },
    { _id: "t4", tenantName: "Sunita Patel", amount: 5900, status: "Overdue", date: "2026-07-31", type: "Monthly Rent", meterNumber: "MT-1004" },
    { _id: "t5", tenantName: "Ravi Kumar",   amount: 6050, status: "Paid",    date: "2026-07-01", type: "Monthly Rent", meterNumber: "MT-1001" },
    { _id: "t6", tenantName: "Priya Sharma", amount: 5750, status: "Paid",    date: "2026-07-03", type: "Monthly Rent", meterNumber: "MT-1002" },
];

const STATUS_STYLES = {
    Paid:    "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Overdue: "bg-red-100 text-red-700",
};

const SUMMARY = [
    { label: "Total Collected",  value: "₹24,670", icon: "💰", color: "green"  },
    { label: "Pending Amount",   value: "₹6,400",  icon: "⏳", color: "yellow" },
    { label: "Overdue Amount",   value: "₹5,900",  icon: "🚨", color: "red"    },
    { label: "Transactions",     value: "6",        icon: "📋", color: "blue"   },
];

const COLOR_MAP = {
    green:  { bg: "bg-green-50",  icon: "bg-green-100",  text: "text-green-700"  },
    yellow: { bg: "bg-yellow-50", icon: "bg-yellow-100", text: "text-yellow-700" },
    red:    { bg: "bg-red-50",    icon: "bg-red-100",    text: "text-red-700"    },
    blue:   { bg: "bg-blue-50",   icon: "bg-blue-100",   text: "text-blue-700"   },
};

function Transactions() {
    const [filterStatus, setFilterStatus] = useState("All");
    const [search, setSearch] = useState("");

    const filtered = MOCK_TRANSACTIONS.filter((tx) => {
        const matchStatus = filterStatus === "All" || tx.status === filterStatus;
        const matchSearch = tx.tenantName.toLowerCase().includes(search.toLowerCase()) ||
                            tx.meterNumber.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Overview of all tenant payment activity</p>
                </div>

                {/* Summary stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    {SUMMARY.map((s) => {
                        const c = COLOR_MAP[s.color];
                        return (
                            <div key={s.label} className={`rounded-xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm`}>
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${c.icon} text-xl`}>
                                        {s.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
                                        <p className={`text-xl font-bold ${c.text} mt-0.5`}>{s.value}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Filters & search bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-5">
                    {/* Search */}
                    <div className="relative flex-1">
                        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">🔍</span>
                        <input
                            id="tx-search"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tenant or meter…"
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                        />
                    </div>

                    {/* Status filter tabs */}
                    <div className="flex gap-1.5 p-1 rounded-xl bg-gray-100 self-start sm:self-auto">
                        {["All", "Paid", "Pending", "Overdue"].map((s) => (
                            <button
                                key={s}
                                id={`tx-filter-${s.toLowerCase()}`}
                                onClick={() => setFilterStatus(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    filterStatus === s
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {/* Export button (placeholder) */}
                    <button
                        id="tx-export-btn"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                        ⬇️ Export
                    </button>
                </div>

                {/* Transaction table */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    {/* Desktop table */}
                    <div className="hidden sm:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50">
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tenant</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Meter</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-gray-400 text-sm">
                                            No transactions match your filters.
                                        </td>
                                    </tr>
                                ) : filtered.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-blue-600">{tx.tenantName[0]}</span>
                                                </div>
                                                <span className="font-medium text-gray-800">{tx.tenantName}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500">{tx.meterNumber}</td>
                                        <td className="px-5 py-4 text-gray-500">{tx.type}</td>
                                        <td className="px-5 py-4 text-gray-500">{new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</td>
                                        <td className="px-5 py-4 text-right font-semibold text-gray-800">₹{tx.amount.toLocaleString()}</td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[tx.status]}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                id={`tx-view-${tx._id}`}
                                                className="text-xs font-medium text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile card list */}
                    <div className="sm:hidden divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <p className="text-center py-12 text-gray-400 text-sm">No transactions match your filters.</p>
                        ) : filtered.map((tx) => (
                            <div key={tx._id} className="px-4 py-4 flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-bold text-blue-600">{tx.tenantName[0]}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{tx.tenantName}</p>
                                        <p className="text-xs text-gray-400">{tx.meterNumber} · {new Date(tx.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-sm font-bold text-gray-800">₹{tx.amount.toLocaleString()}</p>
                                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[tx.status]}`}>
                                        {tx.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Table footer */}
                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                            <p className="text-xs text-gray-400">Showing {filtered.length} of {MOCK_TRANSACTIONS.length} transactions</p>
                            <div className="flex gap-1.5">
                                <button id="tx-prev-btn" className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-white transition-colors disabled:opacity-40" disabled>← Prev</button>
                                <button id="tx-next-btn" className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-white transition-colors">Next →</button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default Transactions;
