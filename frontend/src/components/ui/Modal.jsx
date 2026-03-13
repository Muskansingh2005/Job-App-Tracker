import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ open, onClose, title, children }) => (
    <AnimatePresence>
        {open && (
            <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="w-full max-w-2xl rounded-3xl border border-white/30 bg-white/90 p-6 shadow-card backdrop-blur dark:border-slate-800 dark:bg-slate-950"
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500"
                        >
                            Close
                        </button>
                    </div>
                    <div className="mt-4">{children}</div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default Modal;
