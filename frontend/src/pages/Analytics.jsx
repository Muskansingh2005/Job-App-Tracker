import { useEffect, useState } from "react";
import { getAnalytics } from "../api/jobs.js";
import AnalyticsSection from "../components/AnalyticsSection.jsx";

const Analytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const data = await getAnalytics();
                setAnalytics(data);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load analytics");
            }
        };

        loadAnalytics();
    }, []);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="text-3xl font-semibold text-slate-900">Analytics</h1>
                <p className="mt-2 text-slate-500">Conversion insights and weekly trends.</p>
            </div>
            {error && <p className="text-sm text-rose-500">{error}</p>}
            <AnalyticsSection analytics={analytics} />
        </section>
    );
};

export default Analytics;
