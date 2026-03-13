import { Link } from "react-router-dom";

const Landing = () => (
    <section className="relative -mx-4 overflow-hidden rounded-[32px] bg-[#F8FAFC] px-6 py-12 text-slate-900 md:px-10 lg:px-12">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative space-y-14">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div className="space-y-6">
                    <p className="text-xs uppercase tracking-[0.35em] text-indigo-600">ApplyFlow</p>
                    <h1
                        className="text-4xl font-semibold leading-tight md:text-5xl"
                        style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" }}
                    >
                        Track your job applications like a pro.
                    </h1>
                    <p className="text-base text-slate-600">
                        Organize every opportunity, monitor interview momentum, and never miss a
                        follow-up. ApplyFlow keeps your search focused and confident.
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/register"
                            className="rounded-full bg-brand-primary px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-200/60"
                        >
                            Get Started for Free
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-full border border-slate-300 px-6 py-2 text-sm text-slate-700"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>ApplyFlow overview</span>
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-indigo-700">
                            Live workspace
                        </span>
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">Kanban pipeline</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Drag roles across Applied, Interviewing, Offer, and Rejected.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">Smart reminders</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Follow-ups surface automatically after 7 days.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <p className="text-sm font-semibold text-slate-800">Interview calendar</p>
                            <p className="mt-1 text-xs text-slate-500">
                                Keep every interview on one responsive calendar view.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <section className="space-y-6">
                <div className="text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-indigo-500">Why this exists</p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                        Everything you need to land your next role.
                    </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {[
                        "Scattered applications",
                        "Missed interviews",
                        "No follow-ups"
                    ].map((title) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <p className="text-sm font-semibold text-slate-800">{title}</p>
                            <p className="mt-2 text-xs text-slate-500">
                                ApplyFlow keeps every action, response, and deadline in one space.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="grid gap-6 rounded-3xl border border-indigo-200 bg-indigo-50/70 p-8 md:grid-cols-3">
                <div className="md:col-span-2">
                    <h3 className="text-xl font-semibold text-slate-900">Start tracking today</h3>
                    <p className="mt-2 text-sm text-slate-600">
                        Keep your pipeline organized, follow-ups timely, and interviews visible.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        to="/register"
                        className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/login"
                        className="rounded-full border border-slate-300 px-5 py-2 text-sm text-slate-700"
                    >
                        Sign In
                    </Link>
                </div>
            </section>
        </div>
    </section>
);

export default Landing;
