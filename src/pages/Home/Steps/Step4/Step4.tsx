import { useState, useRef, useCallback } from 'react'
import type { DateClickArg } from '@fullcalendar/interaction'
import type { EventClickArg, EventDropArg, DatesSetArg } from '@fullcalendar/core'
import { CalendarView } from './CalendarView'
import type { CalendarViewHandle } from './CalendarView'
import { ViewSwitcher } from './ViewSwitcher'
import { EventModal } from './EventModal'
import type { CalendarEvent, EventFormData } from './types'

interface Step4Props {
  onSubmit: () => void
  onBack: () => void
}

export const Step4 = ({ onSubmit, onBack }: Step4Props) => {
  const calendarRef = useRef<CalendarViewHandle>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [clickedDate, setClickedDate] = useState<string | null>(null)
  const [clickedTime, setClickedTime] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState('dayGridMonth')
  const [dateTitle, setDateTitle] = useState('')

  const handleDateClick = useCallback((info: DateClickArg) => {
    const dateStr = info.dateStr.split('T')[0] || info.dateStr
    const timeStr = info.dateStr.includes('T')
      ? info.dateStr.split('T')[1]?.substring(0, 5) || null
      : null
    setClickedDate(dateStr)
    setClickedTime(timeStr)
    setSelectedEvent(null)
    setModalMode('create')
    setIsModalOpen(true)
  }, [])

  const handleEventClick = useCallback(
    (info: EventClickArg) => {
      const found = events.find((ev) => ev.id === info.event.id)
      if (found) {
        setSelectedEvent(found)
        setModalMode('edit')
        setIsModalOpen(true)
      }
    },
    [events]
  )

  const handleEventDrop = useCallback((info: EventDropArg) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === info.event.id
          ? { ...ev, start: info.event.startStr, end: info.event.endStr || info.event.startStr }
          : ev
      )
    )
  }, [])

  const handleEventResize = useCallback(
    (info: { event: { id: string; startStr: string; endStr: string } }) => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === info.event.id ? { ...ev, end: info.event.endStr } : ev
        )
      )
    },
    []
  )

  const handleDatesSet = useCallback((info: DatesSetArg) => {
    setDateTitle(info.view.title)
  }, [])

  const handleSaveEvent = useCallback(
    (formData: EventFormData) => {
      if (modalMode === 'create') {
        const newEvent: CalendarEvent = {
          id: crypto.randomUUID(),
          title: formData.title,
          description: formData.description,
          allDay: formData.allDay,
          start: formData.allDay
            ? formData.date
            : `${formData.date}T${formData.startTime}:00`,
          end: formData.allDay
            ? formData.date
            : `${formData.date}T${formData.endTime}:00`,
        }
        setEvents((prev) => [...prev, newEvent])
      } else if (selectedEvent) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === selectedEvent.id
              ? {
                  ...ev,
                  title: formData.title,
                  description: formData.description,
                  allDay: formData.allDay,
                  start: formData.allDay
                    ? formData.date
                    : `${formData.date}T${formData.startTime}:00`,
                  end: formData.allDay
                    ? formData.date
                    : `${formData.date}T${formData.endTime}:00`,
                }
              : ev
          )
        )
      }
      setIsModalOpen(false)
      setSelectedEvent(null)
    },
    [modalMode, selectedEvent]
  )

  const handleDeleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId))
    setIsModalOpen(false)
    setSelectedEvent(null)
  }, [])

  return (
    <div className="bg-surface-900 border border-surface-700 rounded-2xl p-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
          <p className="text-surface-400 text-sm mt-1">
            Click a date to schedule content, drag to reschedule
          </p>
        </div>
        <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
      </div>

      {/* Navigation row */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => calendarRef.current?.prev()}
          className="rounded-lg bg-surface-800 border border-surface-700 p-2 text-surface-300 hover:text-white hover:bg-surface-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => calendarRef.current?.today()}
          className="rounded-lg bg-surface-800 border border-surface-700 px-3 py-1.5 text-sm text-surface-300 hover:text-white hover:bg-surface-700 transition-colors cursor-pointer font-medium"
        >
          Today
        </button>
        <button
          onClick={() => calendarRef.current?.next()}
          className="rounded-lg bg-surface-800 border border-surface-700 p-2 text-surface-300 hover:text-white hover:bg-surface-700 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-white ml-2">{dateTitle}</h3>
      </div>

      {/* Calendar */}
      <CalendarView
        ref={calendarRef}
        events={events}
        currentView={currentView}
        onDateClick={handleDateClick}
        onEventClick={handleEventClick}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onDatesSet={handleDatesSet}
      />

      {/* Event Modal */}
      {isModalOpen && (
        <EventModal
          mode={modalMode}
          event={selectedEvent}
          defaultDate={clickedDate}
          defaultTime={clickedTime}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedEvent(null)
          }}
        />
      )}

      {/* Navigation buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-surface-700 px-6 py-3 text-surface-300 hover:bg-surface-800 font-semibold transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          className="flex-1 rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-white font-semibold transition-colors cursor-pointer"
        >
          Finish
        </button>
      </div>
    </div>
  )
}
