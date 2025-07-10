/** @format */
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import axios from "../api";
import { useNavigate } from "react-router-dom";

const localizer = momentLocalizer(moment);

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassEvents();
  }, []);

  const fetchClassEvents = async () => {
    try {
      const res = await axios.get("/class/my", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const formattedEvents = res.data.map((cls) => ({
        title: cls.title,
        start: new Date(cls.date), // assuming cls.date contains start date
        end: new Date(new Date(cls.date).getTime() + 60 * 60000), // assuming 60 min class
        classId: cls._id,
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error("Calendar fetch error:", err);
    }
  };

  const handleSelectEvent = (event) => {
    navigate(`/class/${event.classId}`);
  };

  return (
    <div className="bg-white p-4 mt-10 rounded-xl shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">
        📅 Scheduled Classes
      </h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleSelectEvent}
        className="rounded-lg"
      />
    </div>
  );
}
