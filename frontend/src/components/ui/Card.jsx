const Card = ({ className = "", children }) => (
    <div
        className={`rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-white to-slate-50 shadow-soft dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 ${className}`}
    >
        {children}
    </div>
);

export default Card;
