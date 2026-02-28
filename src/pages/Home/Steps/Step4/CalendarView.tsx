import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg, DatesSetArg } from '@fullcalendar/core'
import type { CalendarEvent } from './types'
import './calendar-overrides.css'

interface CalendarViewProps {
  events: CalendarEvent[]
  currentView: string
  onDateClick: (info: DateClickArg) => void
  onEventClick: (info: EventClickArg) => void
  onEventDrop: (info: EventDropArg) => void
  onEventResize: (info: { event: { id: string; startStr: string; endStr: string } }) => void
  onDatesSet: (info: DatesSetArg) => void
}

export interface CalendarViewHandle {
  prev: () => void
  next: () => void
  today: () => void
}

export const CalendarView = forwardRef<CalendarViewHandle, CalendarViewProps>(
  ({ events, currentView, onDateClick, onEventClick, onEventDrop, onEventResize, onDatesSet }, ref) => {
    const calendarRef = useRef<FullCalendar>(null)

    useImperativeHandle(ref, () => ({
      prev: () => calendarRef.current?.getApi().prev(),
      next: () => calendarRef.current?.getApi().next(),
      today: () => calendarRef.current?.getApi().today(),
    }))

    useEffect(() => {
      const api = calendarRef.current?.getApi()
      if (api && api.view.type !== currentView) {
        api.changeView(currentView)
      }
    }, [currentView])

    return (
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false}
        events={events}
        editable={true}
        selectable={true}
        dateClick={onDateClick}
        eventClick={onEventClick}
        eventDrop={onEventDrop}
        eventResize={onEventResize}
        datesSet={onDatesSet}
        height="auto"
        dayMaxEvents={3}
        nowIndicator={true}
        eventDisplay="block"
        eventTimeFormat={{
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short',
        }}
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
      />
    )
  }
)
