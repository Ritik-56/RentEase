function StatCard({ label, value, icon, color = "blue" }) {
    const colors = {
        blue:   { iconBg: "bg-blue-100",   text: "text-blue-600"   },
        green:  { iconBg: "bg-green-100",  text: "text-green-600"  },
        yellow: { iconBg: "bg-yellow-100", text: "text-yellow-600" },
        gray:   { iconBg: "bg-gray-100",   text: "text-gray-600"   },
    };

    const c = colors[color] || colors.blue;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.iconBg} text-2xl`}>
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className={`text-2xl font-bold ${c.text}`}>{value}</p>
                </div>
            </div>
        </div>
    );
}

export default StatCard;
