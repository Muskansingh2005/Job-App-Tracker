const isFollowUpRecommended = (job) => {
    if (job.status !== "Applied") return false;
    if (!job.appliedDate) return false;
    const applied = new Date(job.appliedDate);
    const diffDays = (Date.now() - applied.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
};

const JobCard = ({ job, onEdit, onDelete }) => {
    const followUpDate = job.followUpDate ? new Date(job.followUpDate) : null;
    const showRecommended = isFollowUpRecommended(job);
    const showFollowUp = job.status === "Applied";

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">{job.position}</h3>
                    <p className="text-sm text-slate-500">{job.company}</p>
                    {job.location && <p className="text-xs text-slate-400">{job.location}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                        {job.status}
                    </span>
                    {showFollowUp && followUpDate ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-wide text-amber-700">
                            Follow-up {followUpDate.toLocaleDateString()}
                        </span>
                    ) : showFollowUp && showRecommended ? (
                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] uppercase tracking-wide text-amber-700">
                            Follow-up recommended
                        </span>
                    ) : null}
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Applied {new Date(job.appliedDate).toLocaleDateString()}</span>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(job)}
                        className="rounded-md border border-slate-200 px-3 py-1 text-slate-600 hover:border-emerald-300"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(job._id)}
                        className="rounded-md border border-rose-200 px-3 py-1 text-rose-600 hover:border-rose-300"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobCard;
