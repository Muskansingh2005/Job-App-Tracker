const Input = ({ label, className = "", ...props }) => (
    <label className="space-y-2 text-xs uppercase text-slate-500">
        <span>{label}</span>
        <input
            className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
            {...props}
        />
    </label>
);

export default Input;
