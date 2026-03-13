import { useState } from "react";

const JobForm = ({ initialData, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        companyName: initialData?.companyName || initialData?.company || "",
        jobTitle: initialData?.jobTitle || initialData?.position || "",
        jobLink: initialData?.jobLink || "",
        status: (initialData?.status || "applied").toLowerCase(),
        dateApplied: initialData?.dateApplied
            ? new Date(initialData.dateApplied).toISOString().slice(0, 10)
            : initialData?.appliedDate
                ? new Date(initialData.appliedDate).toISOString().slice(0, 10)
                : "",
        notes: initialData?.notes || ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit({
            ...form,
            dateApplied: form.dateApplied ? new Date(form.dateApplied) : undefined
        });
    };

    return (
        <div className="mx-auto w-full max-w-xl">
            <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-xl bg-white p-6 shadow-md"
            >
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Company Name</label>
                    <input
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Job Title</label>
                    <input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Job Link</label>
                    <input
                        name="jobLink"
                        value={form.jobLink}
                        onChange={handleChange}
                        placeholder="https://"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Status</label>
                    <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    >
                        <option value="applied">applied</option>
                        <option value="interviewing">interviewing</option>
                        <option value="offer">offer</option>
                        <option value="rejected">rejected</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Notes</label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows="4"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Date Applied</label>
                    <input
                        name="dateApplied"
                        type="date"
                        value={form.dateApplied}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                        type="submit"
                        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        {initialData ? "Save" : "Add"} Application
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default JobForm;
