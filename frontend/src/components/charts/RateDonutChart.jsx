import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const RateDonutChart = ({ label, value }) => {
    const chartData = [
        { name: "rate", value },
        { name: "rest", value: 100 - value }
    ];

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
            <div className="mt-4 h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            innerRadius={42}
                            outerRadius={64}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            <Cell fill="#06B6D4" />
                            <Cell fill="#1f2937" />
                        </Pie>
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#e2e8f0"
                            fontSize="18"
                            fontWeight="600"
                        >
                            {value}%
                        </text>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400">% of total applications</p>
        </div>
    );
};

export default RateDonutChart;
