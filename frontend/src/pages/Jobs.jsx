import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteJob, getJobs } from "../api/jobs.js";
import Filters from "../components/Filters.jsx";
import Badge from "../components/ui/Badge.jsx";
import Button from "../components/ui/Button.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({ search: "", status: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load applications");
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleSearchChange = (value) => {
        setFilters((prev) => ({ ...prev, search: value }));
    };

    const handleStatusFilter = (value) => {
        setFilters((prev) => ({ ...prev, status: value }));
    };

    const handleDelete = async (id) => {
        await deleteJob(id);
        await loadJobs();
    };

    const getStatusTone = (status) => {
        const normalized = status?.toLowerCase();
        if (normalized === "offer") return "success";
        if (normalized === "interviewing") return "info";
        if (normalized === "rejected") return "warning";
        return "neutral";
    };

    const filteredJobs = useMemo(() => {
        const term = filters.search.trim().toLowerCase();
        return jobs.filter((job) => {
            const companyValue = job.companyName || job.company || "";
            const matchesCompany = term
                ? companyValue.toLowerCase().includes(term)
                : true;
            const matchesStatus = filters.status
                ? job.status?.toLowerCase() === filters.status.toLowerCase()
                : true;
            return matchesCompany && matchesStatus;
        });
    }, [jobs, filters.search, filters.status]);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Applications</h1>
                <p className="mt-2 text-slate-500">Manage every opportunity in one place.</p>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <Filters
                search={filters.search}
                status={filters.status}
                onSearchChange={handleSearchChange}
                onStatusChange={handleStatusFilter}
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-500">{filteredJobs.length} applications</p>
                <Link to="/jobs/new">
                    <Button type="button" className="px-5">
                        Add Application
                    </Button>
                </Link>
            </div>
            {loading ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="h-16 rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
                    <div className="hidden grid-cols-12 gap-4 border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
                        <span className="col-span-4">Company</span>
                        <span className="col-span-3">Job Title</span>
                        <span className="col-span-2">Status</span>
                        <span className="col-span-2">Date Applied</span>
                        <span className="col-span-1 text-right">Actions</span>
                    </div>
                    {filteredJobs.length === 0 ? (
                        <div className="px-4 py-10 text-center text-sm text-slate-500">
                            No applications match your filters.
                        </div>
                    ) : (
                        filteredJobs.map((job) => (
                            <div
                                key={job._id}
                                className="grid grid-cols-1 gap-3 border-t border-slate-100 px-4 py-4 md:grid-cols-12 md:items-center"
                            >
                                <div className="md:col-span-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {job.companyName || job.company}
                                    </p>
                                    {job.jobLink && (
                                        <a
                                            href={job.jobLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-xs text-brand-primary"
                                        >
                                            View job link
                                        </a>
                                    )}
                                </div>
                                <div className="text-sm text-slate-600 md:col-span-3">
                                    {job.jobTitle || job.position}
                                </div>
                                <div className="md:col-span-2">
                                    <Badge tone={getStatusTone(job.status)}>
                                        {job.status?.toLowerCase() || "applied"}
                                    </Badge>
                                </div>
                                <div className="text-sm text-slate-600 md:col-span-2">
                                    {job.dateApplied
                                        ? new Date(job.dateApplied).toLocaleDateString()
                                        : job.appliedDate
                                            ? new Date(job.appliedDate).toLocaleDateString()
                                            : "-"}
                                </div>
                                <div className="flex gap-2 md:col-span-1 md:justify-end">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => handleDelete(job._id)}
                                        className="px-4 text-rose-600 hover:text-rose-700"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
            <Link
                to="/jobs/new"
                className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary text-xl text-white shadow-card hover:brightness-110"
            >
                +
            </Link>
        </section>
    );
};

export default Jobs;
