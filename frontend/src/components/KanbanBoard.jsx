import { useMemo } from "react";
import {
    DndContext,
    PointerSensor,
    KeyboardSensor,
    closestCorners,
    useSensor,
    useSensors,
    useDroppable
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    sortableKeyboardCoordinates
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { STATUS_OPTIONS } from "../utils/statusOptions.js";
import Badge from "./ui/Badge.jsx";

const COLUMN_PREFIX = "column-";

const STATUS_STYLES = {
    Applied: {
        column: "border-indigo-200/80 bg-gradient-to-b from-indigo-50/70 via-white to-white",
        card: "border-indigo-200/70 bg-gradient-to-br from-indigo-50/70 via-white to-white",
        avatar: "bg-indigo-100 text-indigo-700",
        count: "border-indigo-200 bg-indigo-50 text-indigo-700"
    },
    Interviewing: {
        column: "border-cyan-200/80 bg-gradient-to-b from-cyan-50/70 via-white to-white",
        card: "border-cyan-200/70 bg-gradient-to-br from-cyan-50/70 via-white to-white",
        avatar: "bg-cyan-100 text-cyan-700",
        count: "border-cyan-200 bg-cyan-50 text-cyan-700"
    },
    Offer: {
        column: "border-emerald-200/80 bg-gradient-to-b from-emerald-50/70 via-white to-white",
        card: "border-emerald-200/70 bg-gradient-to-br from-emerald-50/70 via-white to-white",
        avatar: "bg-emerald-100 text-emerald-700",
        count: "border-emerald-200 bg-emerald-50 text-emerald-700"
    },
    Rejected: {
        column: "border-rose-200/80 bg-gradient-to-b from-rose-50/70 via-white to-white",
        card: "border-rose-200/70 bg-gradient-to-br from-rose-50/70 via-white to-white",
        avatar: "bg-rose-100 text-rose-700",
        count: "border-rose-200 bg-rose-50 text-rose-700"
    }
};

const normalizeStatus = (status) => {
    if (!status) return status;
    const normalized = status.toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

const getStatusStyle = (status) => {
    const normalized = normalizeStatus(status);
    return STATUS_STYLES[normalized] || STATUS_STYLES.Applied;
};

const isFollowUpRecommended = (job) => {
    if (normalizeStatus(job.status) !== "Applied") return false;
    const appliedValue = job.dateApplied || job.appliedDate;
    if (!appliedValue) return false;
    const applied = new Date(appliedValue);
    const diffDays = (Date.now() - applied.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 7;
};

const KanbanCard = ({ job, onEdit, onDelete }) => {
    const followUpDate = job.followUpDate ? new Date(job.followUpDate) : null;
    const showRecommended = isFollowUpRecommended(job);
    const showFollowUp = normalizeStatus(job.status) === "Applied";
    const companyName = job.companyName || job.company || "";
    const initials = companyName
        ? companyName
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : "CO";
    const normalizedStatus = normalizeStatus(job.status);
    const statusTone =
        normalizedStatus === "Offer"
            ? "success"
            : normalizedStatus === "Interviewing"
                ? "info"
                : normalizedStatus === "Rejected"
                    ? "warning"
                    : "neutral";
    const statusStyle = getStatusStyle(normalizedStatus);
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: job._id
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`hover-float rounded-2xl border p-4 text-left shadow-soft dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:bg-slate-950 ${statusStyle.card} ${isDragging ? "opacity-70" : ""}`}
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold ${statusStyle.avatar}`}>
                        {initials}
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">{job.jobTitle || job.position}</h3>
                        <p className="text-sm text-slate-500">{companyName || "-"}</p>
                        {job.location && <p className="text-xs text-slate-400">{job.location}</p>}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <Badge tone={statusTone}>{normalizedStatus || "Applied"}</Badge>
                    {showFollowUp && followUpDate ? (
                        <Badge tone="warning">Follow-up {followUpDate.toLocaleDateString()}</Badge>
                    ) : showFollowUp && showRecommended ? (
                        <Badge tone="warning">Follow-up recommended</Badge>
                    ) : null}
                </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>
                    Applied {new Date(job.dateApplied || job.appliedDate || Date.now()).toLocaleDateString()}
                </span>
                {(onEdit || onDelete) && (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button
                                type="button"
                                onClick={() => onEdit(job)}
                                className="rounded-full border border-slate-200 px-3 py-1 text-slate-600 hover:border-brand-primary"
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                type="button"
                                onClick={() => onDelete(job._id)}
                                className="rounded-full border border-rose-200 px-3 py-1 text-rose-600 hover:border-rose-300"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const KanbanColumn = ({ status, jobs, onEdit, onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `${COLUMN_PREFIX}${status}` });
    const statusStyle = getStatusStyle(status);

    return (
        <div className={`flex min-h-[320px] flex-col rounded-2xl border shadow-soft dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:bg-slate-950 ${statusStyle.column}`}>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{status}</h2>
                <span className={`rounded-full border px-3 py-1 text-xs ${statusStyle.count}`}>
                    {jobs.length}
                </span>
            </div>
            <div
                ref={setNodeRef}
                className={`flex flex-1 flex-col gap-3 p-4 ${isOver ? "bg-emerald-50/70" : "bg-transparent"}`}
            >
                <SortableContext items={jobs.map((job) => job._id)} strategy={verticalListSortingStrategy}>
                    {jobs.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                            Drop a card here.
                        </p>
                    ) : (
                        jobs.map((job) => (
                            <KanbanCard key={job._id} job={job} onEdit={onEdit} onDelete={onDelete} />
                        ))
                    )}
                </SortableContext>
            </div>
        </div>
    );
};

const KanbanBoard = ({ jobs, onStatusChange, onEdit, onDelete }) => {
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const jobsByStatus = useMemo(
        () =>
            STATUS_OPTIONS.reduce((acc, status) => {
                acc[status] = jobs.filter((job) => normalizeStatus(job.status) === status);
                return acc;
            }, {}),
        [jobs]
    );

    const handleDragEnd = ({ active, over }) => {
        if (!over) return;
        const activeJob = jobs.find((job) => job._id === active.id);
        if (!activeJob) return;

        const overId = over.id;
        const overJob = jobs.find((job) => job._id === overId);
        const nextStatus = overJob
            ? normalizeStatus(overJob.status)
            : String(overId).startsWith(COLUMN_PREFIX)
                ? String(overId).replace(COLUMN_PREFIX, "")
                : null;

        if (!nextStatus || nextStatus === activeJob.status) return;

        onStatusChange?.(activeJob, nextStatus);
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {STATUS_OPTIONS.map((status) => (
                    <KanbanColumn
                        key={status}
                        status={status}
                        jobs={jobsByStatus[status] || []}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export default KanbanBoard;
