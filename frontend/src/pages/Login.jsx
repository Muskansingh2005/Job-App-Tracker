import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(form);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Unable to login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-950">
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Log in to manage your applications.
                </p>
            </div>
            {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                    <label className="text-xs uppercase text-slate-500">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        required
                    />
                </div>
                <div>
                    <label className="text-xs uppercase text-slate-500">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Your password"
                        className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-primary focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:opacity-70"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>
            </form>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                New here?{" "}
                <Link to="/register" className="font-semibold text-brand-primary">
                    Create an account
                </Link>
            </p>
        </div>
    );
};

export default Login;
