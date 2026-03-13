import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { getJobs } from "../api/jobs.js";
import Button from "./ui/Button.jsx";

const Header = () => {
    const { user, token, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationsError, setNotificationsError] = useState("");
    const [notificationsLoading, setNotificationsLoading] = useState(false);

    const initials = user?.name
        ? user.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "AF";

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    useEffect(() => {
        if (!token) {
            setNotifications([]);
            setNotificationsOpen(false);
        }
    }, [token]);

    useEffect(() => {
        const loadNotifications = async () => {
            if (!token || !notificationsOpen) return;
            setNotificationsLoading(true);
            setNotificationsError("");
            try {
                const jobs = await getJobs();
                const now = new Date();
                const weekAhead = new Date();
                weekAhead.setDate(now.getDate() + 7);

                const items = jobs.flatMap((job) => {
                    const results = [];
                    const companyLabel = job.companyName || job.company || "Company";
                    const titleLabel = job.jobTitle || job.position || "Role";

                    if (job.followUpDate) {
                        const followUpDate = new Date(job.followUpDate);
                        if (!Number.isNaN(followUpDate.getTime())) {
                            if (followUpDate < now) {
                                results.push({
                                    id: `${job._id}-followup-overdue`,
                                    title: `Follow-up overdue: ${companyLabel}`,
                                    detail: titleLabel,
                                    date: followUpDate,
                                });
                            } else if (followUpDate <= weekAhead) {
                                results.push({
                                    id: `${job._id}-followup`,
                                    title: `Follow-up due: ${companyLabel}`,
                                    detail: titleLabel,
                                    date: followUpDate,
                                });
                            }
                        }
                    }

                    if (job.interviewDate) {
                        const interviewDate = new Date(job.interviewDate);
                        if (!Number.isNaN(interviewDate.getTime()) && interviewDate >= now && interviewDate <= weekAhead) {
                            results.push({
                                id: `${job._id}-interview`,
                                title: `Interview upcoming: ${companyLabel}`,
                                detail: titleLabel,
                                date: interviewDate,
                            });
                        }
                    }

                    return results;
                });

                items.sort((a, b) => a.date.getTime() - b.date.getTime());
                setNotifications(items.slice(0, 6));
            } catch (err) {
                setNotificationsError(err.response?.data?.message || "Unable to load notifications");
            } finally {
                setNotificationsLoading(false);
            }
        };

        loadNotifications();
    }, [token, notificationsOpen]);

    const notificationCount = useMemo(() => notifications.length, [notifications]);

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-brand-primary">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
                        A
                    </span>
                    ApplyFlow
                </Link>
                <nav className="hidden items-center gap-6 text-sm md:flex">
                    {token ? (
                        <>
                            <NavLink to="/dashboard" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Dashboard
                            </NavLink>
                            <NavLink to="/jobs" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Applications
                            </NavLink>
                            <NavLink to="/analytics" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Analytics
                            </NavLink>
                            <NavLink to="/calendar" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Calendar
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Login
                            </NavLink>
                            <NavLink to="/register" className="text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-200 dark:hover:text-white">
                                Register
                            </NavLink>
                        </>
                    )}
                </nav>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600 transition hover:border-brand-primary dark:border-slate-700 dark:text-slate-200"
                        aria-label="Toggle theme"
                    >
                        {theme === "dark" ? "Light" : "Dark"}
                    </button>
                    {token && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setNotificationsOpen((prev) => !prev)}
                                className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:border-brand-primary dark:border-slate-700 dark:text-slate-200"
                                aria-label="Notifications"
                                aria-expanded={notificationsOpen}
                                aria-haspopup="true"
                            >
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M15 17h5l-1.4-1.4a2 2 0 0 1-.6-1.4V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                                    <path d="M9 17a3 3 0 0 0 6 0" />
                                </svg>
                                {notificationCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-secondary px-1 text-[10px] font-semibold text-white">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>
                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 text-sm shadow-card dark:border-slate-800 dark:bg-slate-950"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notifications</p>
                                            <button
                                                type="button"
                                                onClick={() => setNotificationsOpen(false)}
                                                className="text-xs text-slate-400 hover:text-slate-600"
                                            >
                                                Close
                                            </button>
                                        </div>
                                        <div className="mt-3 space-y-2">
                                            {notificationsLoading ? (
                                                <p className="text-xs text-slate-400">Loading reminders...</p>
                                            ) : notificationsError ? (
                                                <p className="text-xs text-rose-500">{notificationsError}</p>
                                            ) : notificationCount === 0 ? (
                                                <p className="text-xs text-slate-400">No reminders for the next 7 days.</p>
                                            ) : (
                                                notifications.map((item) => (
                                                    <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50 p-2">
                                                        <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                                                        <p className="text-[11px] text-slate-500">{item.detail}</p>
                                                        <p className="mt-1 text-[11px] text-emerald-600">
                                                            {item.date.toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                    {token ? (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setUserMenuOpen((prev) => !prev)}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-xs font-semibold text-white"
                            >
                                {initials}
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute right-0 mt-3 w-40 rounded-2xl border border-slate-200 bg-white p-2 text-sm shadow-card dark:border-slate-800 dark:bg-slate-950"
                                    >
                                        <p className="px-3 py-2 text-xs text-slate-500">{user?.name}</p>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="w-full rounded-xl px-3 py-2 text-left text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                                        >
                                            Logout
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Button variant="primary" className="hidden md:inline-flex" onClick={() => navigate("/register")}
                        >
                            Get Started
                        </Button>
                    )}
                    <button
                        type="button"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-600 md:hidden"
                        aria-label="Toggle menu"
                    >
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-200 bg-white px-4 py-4 text-sm dark:border-slate-800 dark:bg-slate-950 md:hidden"
                    >
                        <div className="flex flex-col gap-3">
                            {token ? (
                                <>
                                    <NavLink to="/dashboard" className="text-slate-600 dark:text-slate-200">Dashboard</NavLink>
                                    <NavLink to="/jobs" className="text-slate-600 dark:text-slate-200">Applications</NavLink>
                                    <NavLink to="/analytics" className="text-slate-600 dark:text-slate-200">Analytics</NavLink>
                                    <NavLink to="/calendar" className="text-slate-600 dark:text-slate-200">Calendar</NavLink>
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="text-left text-slate-600 dark:text-slate-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login" className="text-slate-600 dark:text-slate-200">Login</NavLink>
                                    <NavLink to="/register" className="text-slate-600 dark:text-slate-200">Register</NavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
