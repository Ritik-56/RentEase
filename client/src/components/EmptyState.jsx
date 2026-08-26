function EmptyState({ icon = "📭", message, sub }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-5xl mb-4">{icon}</span>
            <p className="text-base font-medium text-gray-600">{message}</p>
            {sub && <p className="text-sm text-gray-400 mt-1">{sub}</p>}
        </div>
    );
}

export default EmptyState;
