import * as React from "react";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Clock, X } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  color?: string;
  description?: string;
}

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onAddEvent?: (event: Omit<CalendarEvent, "id">) => void;
  onDeleteEvent?: (id: string) => void;
  className?: string;
}

export function EventCalendar({
  events: initialEvents = [],
  onAddEvent,
  onDeleteEvent,
  className,
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventTime, setNewEventTime] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  const eventsForDate = useMemo(() => {
    const eventMap = new Map<string, CalendarEvent[]>();
    events.forEach((event) => {
      const key = format(event.date, "yyyy-MM-dd");
      if (!eventMap.has(key)) {
        eventMap.set(key, []);
      }
      eventMap.get(key)?.push(event);
    });
    return eventMap;
  }, [events]);

  const getEventsForDay = (date: Date) => {
    const key = format(date, "yyyy-MM-dd");
    return eventsForDate.get(key) || [];
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleAddEvent = () => {
    if (!selectedDate || !newEventTitle.trim()) return;

    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEventTitle.trim(),
      date: selectedDate,
      time: newEventTime || "12:00",
      color: "blue",
      ...(newEventDescription.trim() && {
        description: newEventDescription.trim(),
      }),
    };

    setEvents((prev) => [...prev, newEvent]);
    const { id: _id, ...rest } = newEvent;
    onAddEvent?.(rest);
    setNewEventTitle("");
    setNewEventTime("");
    setNewEventDescription("");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    onDeleteEvent?.(id);
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  return (
    <div className={cn("w-full max-w-6xl mx-auto", className)}>
      <Card>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {format(currentDate, "MMMM yyyy")}
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentDate(new Date())}
              >
                Today
              </Button>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {paddingDays.map((_, idx) => (
                  <div key={`padding-${idx}`} className="aspect-square" />
                ))}
                {monthDays.map((day) => {
                  const dayEvents = getEventsForDay(day);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentDay = isToday(day);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "aspect-square p-2 rounded-lg border transition-all hover:border-primary",
                        isSelected &&
                          "bg-primary text-primary-foreground border-primary",
                        isCurrentDay &&
                          !isSelected &&
                          "border-primary",
                        !isSelected && "hover:bg-accent"
                      )}
                    >
                      <div className="flex flex-col h-full">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            isSelected && "text-primary-foreground"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        <div className="flex-1 mt-1 space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={cn(
                                "text-[10px] truncate rounded px-1",
                                isSelected
                                  ? "bg-primary-foreground/20"
                                  : "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                              )}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-[10px] text-muted-foreground">
                              +{dayEvents.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Details Panel */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "Select a date"}
                </h3>

                {selectedDate && (
                  <div className="space-y-3">
                    {/* Add Event Form */}
                    <div className="space-y-2 p-4 border rounded-lg bg-accent/50">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Plus className="h-4 w-4" />
                        Add Event
                      </div>
                      <Input
                        placeholder="Event title"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                      />
                      <Textarea
                        placeholder="Description (optional)"
                        value={newEventDescription}
                        onChange={(e) => setNewEventDescription(e.target.value)}
                        className="min-h-[60px] resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Input
                          type="time"
                          value={newEventTime}
                          onChange={(e) => setNewEventTime(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleAddEvent} size="sm">
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="space-y-2">
                      {selectedDayEvents.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No events for this day
                        </p>
                      ) : (
                        selectedDayEvents.map((event) => (
                          <div
                            key={event.id}
                            className="flex items-start justify-between gap-2 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground">
                                  {event.time}
                                </span>
                              </div>
                              <p className="font-medium text-sm mt-1 truncate">
                                {event.title}
                              </p>
                              {event.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
