import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../api/jobs.js";
import JobForm from "../components/JobForm.jsx";

const AddJob = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSubmit = async (payload) => {
        try {
            await createJob(payload);
            navigate("/jobs");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to create application");
        }
    };

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Add Job Application</h1>
                <p className="mt-2 text-slate-500">Track a new opportunity in your pipeline.</p>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <JobForm onSubmit={handleSubmit} onCancel={() => navigate("/jobs")} />
        </section>
    );
};

export default AddJob;
