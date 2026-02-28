import { useState, useEffect } from 'react'
import type { CalendarEvent, EventFormData } from './types'

interface EventModalProps {
  mode: 'create' | 'edit'
  event: CalendarEvent | null
  defaultDate: string | null
  defaultTime: string | null
  onSave: (data: EventFormData) => void
  onDelete: (eventId: string) => void
  onClose: () => void
}

export const EventModal = ({
  mode,
  event,
  defaultDate,
  defaultTime,
  onSave,
  onDelete,
  onClose,
}: EventModalProps) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [allDay, setAllDay] = useState(false)

  useEffect(() => {
    if (mode === 'edit' && event) {
      setTitle(event.title)
      setDescription(event.description)
      setAllDay(event.allDay)
      if (event.allDay) {
        setDate(event.start.split('T')[0] || event.start)
      } else {
        setDate(event.start.split('T')[0])
        setStartTime(event.start.split('T')[1]?.substring(0, 5) || '09:00')
        setEndTime(event.end.split('T')[1]?.substring(0, 5) || '10:00')
      }
    } else {
      if (defaultDate) setDate(defaultDate)
      if (defaultTime) {
        setStartTime(defaultTime)
        const [h, m] = defaultTime.split(':').map(Number)
        setEndTime(`${String(h + 1).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
      }
    }
  }, [mode, event, defaultDate, defaultTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({ title: title.trim(), description: description.trim(), date, startTime, endTime, allDay })
  }

  const isValid = title.trim().length > 0 && date.length > 0 && (allDay || endTime > startTime)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-800 border border-surface-700 rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {mode === 'create' ? 'Schedule Content' : 'Edit Schedule'}
          </h3>
          <button
            onClick={onClose}
            className="text-surface-400 hover:text-white transition-colors cursor-pointer p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Topic/Title */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Publish Topic
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blog post about AI trends"
              autoFocus
              className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-white placeholder-surface-500 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">
              Description <span className="text-surface-500">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief notes about the content..."
              rows={2}
              className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-white placeholder-surface-500 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors resize-none"
            />
          </div>

          {/* All Day Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-9 h-5 rounded-full relative transition-colors ${
                allDay ? 'bg-primary-500' : 'bg-surface-700'
              }`}
              onClick={() => setAllDay(!allDay)}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  allDay ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </div>
            <span className="text-sm text-surface-300">All day</span>
          </label>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-surface-300 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors [color-scheme:dark]"
            />
          </div>

          {/* Time inputs (hidden when allDay) */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full rounded-lg bg-surface-900 border border-surface-700 px-4 py-2.5 text-white text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
          )}

          {/* Validation hint */}
          {!allDay && startTime && endTime && endTime <= startTime && (
            <p className="text-sm text-error">End time must be after start time</p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            {mode === 'edit' && event && (
              <button
                type="button"
                onClick={() => onDelete(event.id)}
                className="rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-surface-700 px-4 py-2.5 text-surface-300 hover:bg-surface-700 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="flex-1 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2.5 text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              {mode === 'create' ? 'Schedule' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
