export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  description: string
  allDay: boolean
}

export interface EventFormData {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  allDay: boolean
}
