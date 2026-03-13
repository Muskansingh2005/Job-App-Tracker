import { Link } from "react-router-dom";

const NotFound = () => (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <h1 className="text-2xl font-semibold text-white">Page not found</h1>
        <p className="mt-2 text-sm text-slate-400">The page you are looking for does not exist.</p>
        <Link
            to="/"
            className="mt-6 inline-flex rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950"
        >
            Back to dashboard
        </Link>
    </div>
);

export default NotFound;
