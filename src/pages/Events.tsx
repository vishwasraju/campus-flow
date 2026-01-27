import { useState } from "react";
import { EventCalendar, type CalendarEvent } from "@/components/EventCalendar";

const DEMO_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Team Meeting",
    date: new Date(),
    time: "10:00",
    color: "blue",
    description: "Weekly team sync",
  },
  {
    id: "2",
    title: "Project Review",
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    time: "14:00",
    color: "green",
  },
  {
    id: "3",
    title: "Client Call",
    date: new Date(new Date().setDate(new Date().getDate() + 5)),
    time: "11:30",
    color: "purple",
  },
];

export default function Events() {
  const [events, setEvents] = useState<CalendarEvent[]>(DEMO_EVENTS);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Events Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your events
        </p>
      </div>

      <EventCalendar
        events={events}
        onAddEvent={(event) => {
          const newEvent: CalendarEvent = {
            ...event,
            id: Math.random().toString(36).substr(2, 9),
          };
          setEvents((prev) => [...prev, newEvent]);
        }}
        onDeleteEvent={(id) => {
          setEvents((prev) => prev.filter((e) => e.id !== id));
        }}
      />
    </div>
  );
}
