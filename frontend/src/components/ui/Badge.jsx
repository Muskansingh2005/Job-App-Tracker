const toneStyles = {
    neutral: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    info: "bg-indigo-50 text-indigo-700 border border-indigo-200"
};

const Badge = ({ tone = "neutral", className = "", children }) => (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]} ${className}`}>
        {children}
    </span>
);

export default Badge;
