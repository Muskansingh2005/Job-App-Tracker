import WeeklyApplicationsChart from "./charts/WeeklyApplicationsChart.jsx";
import RateDonutChart from "./charts/RateDonutChart.jsx";

const AnalyticsSection = ({ analytics }) => {
    const weeklyData = analytics?.weeklyCounts || [];
    const rates = analytics?.rates || { interview: 0, offer: 0, rejected: 0 };

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Analytics</h2>
                <p className="mt-1 text-sm text-slate-500">Monitor conversion across each stage.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-4">
                <div className="lg:col-span-2">
                    <WeeklyApplicationsChart data={weeklyData} />
                </div>
                <RateDonutChart label="Interview conversion" value={rates.interview} />
                <RateDonutChart label="Offer rate" value={rates.offer} />
                <RateDonutChart label="Rejection rate" value={rates.rejected} />
            </div>
        </section>
    );
};

export default AnalyticsSection;
