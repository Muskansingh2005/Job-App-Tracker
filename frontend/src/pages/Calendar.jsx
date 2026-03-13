import { useEffect, useMemo, useState } from "react";
import { getJobs } from "../api/jobs.js";
import InterviewsCalendar from "../components/InterviewsCalendar.jsx";

const Calendar = () => {
    const [applications, setApplications] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadApplications = async () => {
            try {
                const data = await getJobs();
                setApplications(data);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load applications");
            }
        };

        loadApplications();
    }, []);

    const events = useMemo(() => {
        return applications
            .map((job) => {
                const date = job.dateApplied || job.appliedDate;
                if (!date) return null;
                const start = new Date(date);
                if (Number.isNaN(start.getTime())) return null;
                return {
                    id: job._id,
                    title: `${job.companyName || job.company} - ${job.jobTitle || job.position}`,
                    start,
                    end: new Date(start.getTime() + 60 * 60 * 1000)
                };
            })
            .filter(Boolean);
    }, [applications]);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Calendar</h1>
                <p className="mt-2 text-slate-500">Track application dates across your pipeline.</p>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3">
                    <InterviewsCalendar
                        events={events}
                        title="Application calendar"
                        subtitle="Month view"
                    />
                </div>
                <aside className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-slate-900">Applications</h3>
                            <span className="text-xs text-slate-400">All dates</span>
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-slate-600">
                            {applications.length === 0 ? (
                                <p className="text-slate-400">No applications logged.</p>
                            ) : (
                                applications.map((job) => (
                                    <div key={job._id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                        <p className="font-semibold text-slate-900">
                                            {job.companyName || job.company}
                                        </p>
                                        <p className="text-slate-500">{job.jobTitle || job.position}</p>
                                        {(job.dateApplied || job.appliedDate) && (
                                            <p className="mt-1 text-xs text-emerald-600">
                                                {new Date(job.dateApplied || job.appliedDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-900">Application stats</h3>
                        <div className="mt-3 text-xs text-slate-500">
                            Total tracked
                        </div>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                            {applications.length}
                        </p>
                        <div className="mt-3 h-2 rounded-full bg-slate-100">
                            <div
                                className="h-2 rounded-full bg-emerald-400"
                                style={{ width: `${Math.min(applications.length * 8, 100)}%` }}
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
};

export default Calendar;
