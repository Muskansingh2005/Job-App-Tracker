import { useEffect, useMemo, useState } from "react";
import { getJobs, updateJob } from "../api/jobs.js";
import StatCard from "../components/ui/StatCard.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import KanbanBoard from "../components/KanbanBoard.jsx";

const Dashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const normalizeStatus = (status) => {
        if (!status) return status;
        const normalized = status.toLowerCase();
        return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    };

    const reminders = useMemo(() => {
        const now = new Date();
        const weekAhead = new Date();
        weekAhead.setDate(now.getDate() + 7);

        const recommended = jobs.filter((job) => {
            const appliedValue = job.dateApplied || job.appliedDate;
            if (normalizeStatus(job.status) !== "Applied" || !appliedValue) return false;
            const applied = new Date(appliedValue);
            const diffDays = (now.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24);
            return diffDays >= 7;
        });

        const upcoming = jobs.filter((job) => {
            if (!job.followUpDate) return false;
            const date = new Date(job.followUpDate);
            return date >= now && date <= weekAhead;
        });

        return {
            recommendedCount: recommended.length,
            upcomingCount: upcoming.length,
        };
    }, [jobs]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const jobsData = await getJobs();
                setJobs(jobsData);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load dashboard data");
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const handleStatusChange = async (job, nextStatus) => {
        const previousStatus = job.status;
        setJobs((prev) =>
            prev.map((item) => (item._id === job._id ? { ...item, status: nextStatus } : item))
        );

        try {
            await updateJob(job._id, { status: nextStatus });
        } catch (err) {
            setError(err.response?.data?.message || "Unable to update status");
            setJobs((prev) =>
                prev.map((item) =>
                    item._id === job._id ? { ...item, status: previousStatus } : item
                )
            );
        }
    };

    const total = jobs.length;
    const interviews = jobs.filter((job) => normalizeStatus(job.status) === "Interviewing").length;
    const offers = jobs.filter((job) => normalizeStatus(job.status) === "Offer").length;
    const responseRate = total
        ? Math.round(((interviews + offers) / total) * 100)
        : 0;

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
                <p className="mt-2 text-slate-500">A clear view of your pipeline performance.</p>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className="h-28 rounded-2xl" />
                    ))
                ) : (
                    <>
                        <StatCard
                            title="Total Applications"
                            value={total}
                            gradient="bg-gradient-to-br from-indigo-50 to-white"
                            icon={
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Interviews"
                            value={interviews}
                            gradient="bg-gradient-to-br from-cyan-50 to-white"
                            icon={
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="7" />
                                    <path d="M12 8v4l3 2" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Offers"
                            value={offers}
                            gradient="bg-gradient-to-br from-emerald-50 to-white"
                            icon={
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 3l7 7-7 11-7-11 7-7z" />
                                </svg>
                            }
                        />
                        <StatCard
                            title="Response Rate"
                            value={`${responseRate}%`}
                            gradient="bg-gradient-to-br from-amber-50 to-white"
                            icon={
                                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12h6l3 8 4-16 2 8h3" />
                                </svg>
                            }
                        />
                    </>
                )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-soft">
                    <p className="text-xs uppercase tracking-wide text-amber-700">Follow-up recommended</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {reminders.recommendedCount}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Follow-ups due in 7 days</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">
                        {reminders.upcomingCount}
                    </p>
                </div>
            </div>
            <KanbanBoard jobs={jobs} onStatusChange={handleStatusChange} />
        </section>
    );
};

export default Dashboard;
