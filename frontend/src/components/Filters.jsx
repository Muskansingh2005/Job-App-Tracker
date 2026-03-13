import { STATUS_OPTIONS } from "../utils/statusOptions.js";

const Filters = ({ search, status, onSearchChange, onStatusChange }) => {
    const statuses = ["All", ...STATUS_OPTIONS];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 focus-within:border-brand-primary">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.5-3.5" />
                    </svg>
                    <input
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search company"
                        className="w-full bg-transparent text-sm text-slate-700 outline-none"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((option) => {
                        const value = option === "All" ? "" : option;
                        const isActive = status === value;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => onStatusChange(value)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${isActive
                                    ? "bg-brand-primary text-white shadow-soft"
                                    : "border border-slate-200 text-slate-600 hover:border-brand-primary"
                                    }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Filters;
