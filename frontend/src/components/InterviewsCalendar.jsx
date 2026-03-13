import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
    "en-US": enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales
});

const InterviewsCalendar = ({ events = [], title = "Interview calendar", subtitle = "Month view" }) => {
    const calendarEvents = Array.isArray(events) ? events : [];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
                <span className="text-xs text-slate-400">{subtitle}</span>
            </div>
            <div className="mt-4 h-[480px]">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    views={["month", "week", "day"]}
                    popup
                    style={{ height: "100%" }}
                />
            </div>
        </div>
    );
};

export default InterviewsCalendar;
