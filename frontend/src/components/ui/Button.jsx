const styles = {
    base:
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent",
    variants: {
        primary:
            "bg-brand-primary text-white shadow-soft hover:brightness-110 focus:ring-brand-primary",
        secondary:
            "bg-brand-secondary text-white shadow-soft hover:brightness-110 focus:ring-brand-secondary",
        ghost:
            "bg-transparent text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white",
        outline:
            "border border-slate-200 text-slate-600 hover:border-brand-primary dark:border-slate-700 dark:text-slate-200"
    }
};

const Button = ({ variant = "primary", className = "", ...props }) => (
    <button className={`${styles.base} ${styles.variants[variant]} ${className}`} {...props} />
);

export default Button;
