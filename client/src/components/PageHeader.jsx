function PageHeader({ title, subtitle, action }) {
    return (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
            </div>
            {action && <div className="mt-3 sm:mt-0">{action}</div>}
        </div>
    );
}

export default PageHeader;
