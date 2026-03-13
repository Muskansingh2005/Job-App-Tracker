import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, gradient }) => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className={`rounded-2xl border border-slate-200 p-5 shadow-card dark:border-slate-800 dark:bg-slate-950 ${gradient}`}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
            </div>
            <div className="rounded-full bg-white/80 p-3 text-slate-700 shadow-sm dark:bg-slate-900 dark:text-slate-200">
                {icon}
            </div>
        </div>
    </motion.div>
);

export default StatCard;
