import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Header from "./components/Header.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import AddJob from "./pages/AddJob.jsx";
import Analytics from "./pages/Analytics.jsx";
import Calendar from "./pages/Calendar.jsx";
import Landing from "./pages/Landing.jsx";
import NotFound from "./pages/NotFound.jsx";

const App = () => {
    const location = useLocation();

    return (
        <div className="min-h-screen">
            <Header />
            <main className="mx-auto max-w-6xl px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.25 }}
                    >
                        <Routes location={location}>
                            <Route path="/" element={<Landing />} />
                            <Route
                                path="/dashboard"
                                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                            />
                            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
                            <Route path="/jobs/new" element={<ProtectedRoute><AddJob /></ProtectedRoute>} />
                            <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/home" element={<Navigate to="/dashboard" replace />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;
