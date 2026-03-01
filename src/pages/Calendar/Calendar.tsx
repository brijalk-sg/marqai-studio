import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon, Badge } from '../../components/ui'
import { css } from '../../lib/styles'

interface CalendarEvent {
  id: number
  title: string
  type: string
  status: string
  date: string // YYYY-MM-DD
  time: string // HH:mm
  color: string
  description?: string
}

const typeIcons: Record<string, string> = { blog: "📝", linkedin: "💼", twitter: "🐦", video: "🎬", report: "📊", event: "📌" }
const typeColors: Record<string, string> = { blog: "#6366f1", linkedin: "#0077b5", twitter: "#1da1f2", video: "#ec4899", report: "#f59e0b", event: "#8b5cf6" }
const statusColors: Record<string, string> = { planning: "#64748b", in_progress: "#6366f1", scheduled: "#3b82f6", approval: "#f59e0b", published: "#10b981" }
const statusLabels: Record<string, string> = { planning: "Planning", in_progress: "In Progress", scheduled: "Scheduled", approval: "Approval", published: "Published" }

const initialEvents: CalendarEvent[] = [
  { id: 1, title: "AI Fraud ROI Article", type: "blog", status: "in_progress", date: "2026-03-01", time: "10:00", color: "#6366f1" },
  { id: 2, title: "PCI DSS 4.0 Guide", type: "blog", status: "approval", date: "2026-03-02", time: "14:00", color: "#f59e0b" },
  { id: 3, title: "LinkedIn: FedNow Fraud", type: "linkedin", status: "scheduled", date: "2026-03-02", time: "09:00", color: "#3b82f6" },
  { id: 4, title: "Featurespace vs Feedzai", type: "blog", status: "published", date: "2026-03-03", time: "11:00", color: "#10b981" },
  { id: 5, title: "Twitter: PCI DSS Tips", type: "twitter", status: "scheduled", date: "2026-03-04", time: "16:00", color: "#3b82f6" },
  { id: 6, title: "False Positives Playbook", type: "blog", status: "planning", date: "2026-03-05", time: "10:00", color: "#8b5cf6" },
  { id: 7, title: "FedNow Architecture", type: "blog", status: "scheduled", date: "2026-03-05", time: "15:00", color: "#10b981" },
  { id: 8, title: "LinkedIn: ROI Stats", type: "linkedin", status: "planning", date: "2026-03-07", time: "12:00", color: "#6366f1" },
  { id: 9, title: "Vendor Comparison Script", type: "video", status: "planning", date: "2026-03-08", time: "10:00", color: "#ec4899" },
  { id: 10, title: "Monthly SEO Report", type: "report", status: "planning", date: "2026-03-10", time: "09:00", color: "#f59e0b" },
]

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 7am to 8pm

function fmt(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` }
function fmtShort(d: Date) { return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }

export const Calendar = () => {
  const location = useLocation()
  const [calView, setCalView] = useState<"month" | "week" | "day">("month")
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1))
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const stored = localStorage.getItem("marqai_calendar_events")
      if (stored) return JSON.parse(stored) as CalendarEvent[]
    } catch { /* ignore */ }
    return initialEvents
  })
  const [showForm, setShowForm] = useState(false)
  const [editEvent, setEditEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState({ title: "", type: "blog", status: "scheduled", date: "", time: "10:00", description: "" })
  const [selectedDayEvents, setSelectedDayEvents] = useState<string | null>(null)

  const today = new Date(2026, 2, 1)

  useEffect(() => {
    localStorage.setItem("marqai_calendar_events", JSON.stringify(events))
  }, [events])

  // Handle incoming brief from ContentStudio
  useEffect(() => {
    const state = location.state as { scheduleBrief?: { id: string; title: string; keyword: string; type: string } } | null
    if (state?.scheduleBrief) {
      setFormData({
        title: state.scheduleBrief.title,
        type: state.scheduleBrief.type || "blog",
        status: "scheduled",
        date: fmt(new Date(today.getTime() + 3 * 86400000)),
        time: "10:00",
        description: `Content brief: ${state.scheduleBrief.keyword}`,
      })
      setShowForm(true) 
      window.history.replaceState({}, document.title)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const navigate = (dir: number) => {
    const d = new Date(currentDate)
    if (calView === "month") d.setMonth(d.getMonth() + dir)
    else if (calView === "week") d.setDate(d.getDate() + dir * 7)
    else d.setDate(d.getDate() + dir)
    setCurrentDate(d)
  }

  const goToday = () => setCurrentDate(new Date(today))

  const openAddForm = (date?: string) => {
    setEditEvent(null)
    setFormData({ title: "", type: "blog", status: "scheduled", date: date || fmt(currentDate), time: "10:00", description: "" })
    setShowForm(true)
  }

  const openEditForm = (ev: CalendarEvent) => {
    setEditEvent(ev)
    setFormData({ title: ev.title, type: ev.type, status: ev.status, date: ev.date, time: ev.time, description: ev.description || "" })
    setShowForm(true)
  }

  const saveEvent = () => {
    if (!formData.title.trim() || !formData.date) return
    if (editEvent) {
      setEvents(prev => prev.map(e => e.id === editEvent.id ? { ...e, ...formData, color: typeColors[formData.type] || "#6366f1" } : e))
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now(),
        ...formData,
        color: typeColors[formData.type] || "#6366f1",
      }
      setEvents(prev => [...prev, newEvent])
    }
    setShowForm(false)
    setEditEvent(null)
  }

  const deleteEvent = (id: number) => {
    setEvents(prev => prev.filter(e => e.id !== id))
    setShowForm(false)
    setEditEvent(null)
  }

  const getEventsForDate = (dateStr: string) => events.filter(e => e.date === dateStr)

  // Month view helpers
  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const prevDays = new Date(year, month, 0).getDate()
    const cells: { date: Date; inMonth: boolean }[] = []
    for (let i = firstDay - 1; i >= 0; i--) cells.push({ date: new Date(year, month - 1, prevDays - i), inMonth: false })
    for (let i = 1; i <= daysInMonth; i++) cells.push({ date: new Date(year, month, i), inMonth: true })
    const remaining = 42 - cells.length
    for (let i = 1; i <= remaining; i++) cells.push({ date: new Date(year, month + 1, i), inMonth: false })
    return cells
  }

  // Week view helpers
  const getWeekDays = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay())
    return Array.from({ length: 7 }, (_, i) => { const day = new Date(d); day.setDate(d.getDate() + i); return day })
  }

  const headerLabel = () => {
    if (calView === "month") return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    if (calView === "week") {
      const days = getWeekDays()
      return `${fmtShort(days[0])} — ${fmtShort(days[6])}`
    }
    return currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
  }

  // Event card renderer
  const renderEventChip = (ev: CalendarEvent, compact = false) => (
    <div
      key={ev.id}
      onClick={(e) => { e.stopPropagation(); openEditForm(ev) }}
      style={{
        padding: compact ? "2px 5px" : "4px 7px",
        borderRadius: 4,
        border: `1px solid ${ev.color}30`,
        background: `${ev.color}15`,
        marginBottom: 2,
        cursor: "pointer",
        overflow: "hidden",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: compact ? 8 : 9, flexShrink: 0 }}>{typeIcons[ev.type] || "📌"}</span>
        <span style={{ fontSize: compact ? 8 : 9, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{ev.title}</span>
      </div>
      {!compact && <span style={{ fontSize: 8, color: "#64748b" }}>{ev.time}</span>}
    </div>
  )

  // ---- MONTH VIEW ----
  const renderMonth = () => {
    const cells = getMonthDays()
    return (
      <div style={{ ...css.card, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {DAY_NAMES.map(d => (
            <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
          {cells.map((cell, i) => {
            const dateStr = fmt(cell.date)
            const isToday = dateStr === fmt(today)
            const dayEvents = getEventsForDate(dateStr)
            return (
              <div
                key={i}
                onClick={() => { if (calView === "month") { setSelectedDayEvents(selectedDayEvents === dateStr ? null : dateStr); } }}
                style={{
                  minHeight: 90,
                  padding: "4px 5px",
                  borderRight: (i + 1) % 7 !== 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  borderBottom: i < 35 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  opacity: cell.inMonth ? 1 : 0.35,
                  cursor: "pointer",
                  background: selectedDayEvents === dateStr ? "rgba(99,102,241,0.04)" : "transparent",
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: isToday ? "#818cf8" : "#94a3b8",
                    width: 22, height: 22, borderRadius: 6,
                    background: isToday ? "rgba(99,102,241,0.15)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>{cell.date.getDate()}</span>
                  {cell.inMonth && (
                    <button
                      onClick={(e) => { e.stopPropagation(); openAddForm(dateStr) }}
                      style={{ width: 16, height: 16, borderRadius: 4, border: "none", background: "transparent", color: "#334155", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >+</button>
                  )}
                </div>
                {dayEvents.slice(0, 3).map(ev => renderEventChip(ev, true))}
                {dayEvents.length > 3 && (
                  <span style={{ fontSize: 8, color: "#818cf8", fontWeight: 600, padding: "0 5px" }}>+{dayEvents.length - 3} more</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- WEEK VIEW ----
  const renderWeek = () => {
    const days = getWeekDays()
    return (
      <div style={{ ...css.card, overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "50px repeat(7, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ padding: 8 }} />
          {days.map((day, i) => {
            const isToday = fmt(day) === fmt(today)
            return (
              <div key={i} style={{ padding: "8px 4px", textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>{DAY_NAMES[day.getDay()]}</div>
                <div style={{
                  fontSize: 16, fontWeight: 800,
                  color: isToday ? "#818cf8" : "#94a3b8",
                  width: 28, height: 28, borderRadius: 7,
                  background: isToday ? "rgba(99,102,241,0.15)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", margin: "2px auto 0",
                }}>{day.getDate()}</div>
              </div>
            )
          })}
        </div>
        {/* Time grid */}
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          {HOURS.map(hour => (
            <div key={hour} style={{ display: "grid", gridTemplateColumns: "50px repeat(7, 1fr)", minHeight: 50, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ padding: "4px 6px", fontSize: 9, color: "#475569", fontWeight: 600, textAlign: "right" }}>
                {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
              </div>
              {days.map((day, di) => {
                const dateStr = fmt(day)
                const hourEvents = getEventsForDate(dateStr).filter(e => parseInt(e.time.split(":")[0]) === hour)
                return (
                  <div
                    key={di}
                    onClick={() => openAddForm(dateStr)}
                    style={{ borderLeft: "1px solid rgba(255,255,255,0.04)", padding: "2px 3px", cursor: "pointer" }}
                  >
                    {hourEvents.map(ev => renderEventChip(ev))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ---- DAY VIEW ----
  const renderDay = () => {
    const dateStr = fmt(currentDate)
    const dayEvents = getEventsForDate(dateStr)
    return (
      <div style={{ ...css.card, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{currentDate.toLocaleDateString("en-US", { weekday: "long" })}</span>
            <span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>{dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={() => openAddForm(dateStr)} style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 11, padding: "6px 12px" }}>+ Add Event</button>
        </div>
        <div style={{ maxHeight: 550, overflowY: "auto" }}>
          {HOURS.map(hour => {
            const hourEvents = dayEvents.filter(e => parseInt(e.time.split(":")[0]) === hour)
            return (
              <div key={hour} onClick={() => { setFormData(f => ({ ...f, date: dateStr, time: `${String(hour).padStart(2, "0")}:00` })); openAddForm(dateStr) }} style={{ display: "grid", gridTemplateColumns: "60px 1fr", minHeight: 54, borderBottom: "1px solid rgba(255,255,255,0.03)", cursor: "pointer" }}>
                <div style={{ padding: "6px 10px", fontSize: 11, color: "#475569", fontWeight: 600, textAlign: "right" }}>
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? "12 PM" : `${hour} AM`}
                </div>
                <div style={{ borderLeft: "1px solid rgba(255,255,255,0.04)", padding: "4px 8px" }}>
                  {hourEvents.map(ev => (
                    <div key={ev.id} onClick={(e) => { e.stopPropagation(); openEditForm(ev) }} style={{ padding: "8px 12px", borderRadius: 7, border: `1px solid ${ev.color}30`, background: `${ev.color}10`, marginBottom: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>{typeIcons[ev.type] || "📌"}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{ev.title}</p>
                        <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: "#64748b" }}>{ev.time}</span>
                          <Badge color={statusColors[ev.status] || "#64748b"}>{statusLabels[ev.status] || ev.status}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ---- EVENT FORM MODAL ----
  const renderFormModal = () => {
    if (!showForm) return null
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={() => { setShowForm(false); setEditEvent(null) }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }} />
        <div style={{ position: "relative", width: 440, maxHeight: "85vh", overflowY: "auto", background: "#0f1629", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>{editEvent ? "Edit Event" : "Add New Event"}</h2>
            <button onClick={() => { setShowForm(false); setEditEvent(null) }} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 18 }}><Icon name="x" size={18} /></button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Event Title *</label>
              <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Enter event title..." style={css.input} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Date *</label>
                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Time *</label>
                <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} style={{ ...css.input, colorScheme: "dark" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Type</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {Object.entries(typeIcons).map(([key, icon]) => (
                    <button
                      key={key}
                      onClick={() => setFormData({ ...formData, type: key })}
                      style={{
                        padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer",
                        border: formData.type === key ? `1px solid ${typeColors[key] || "#6366f1"}40` : "1px solid rgba(255,255,255,0.08)",
                        background: formData.type === key ? `${typeColors[key] || "#6366f1"}15` : "transparent",
                        color: formData.type === key ? "#e2e8f0" : "#64748b",
                        display: "flex", alignItems: "center", gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{icon}</span> {key}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Status</label>
                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ ...css.input, background: "#0f1629" }}>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Description</label>
              <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} placeholder="Optional description..." style={{ ...css.input, resize: "vertical" }} />
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={saveEvent} style={{ flex: 1, padding: "11px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {editEvent ? "Save Changes" : "Add Event"}
              </button>
              {editEvent && (
                <button onClick={() => deleteEvent(editEvent.id)} style={{ padding: "11px 16px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#fca5a5", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ---- SELECTED DAY DETAIL PANEL (for month view) ----
  const renderDayDetail = () => {
    if (!selectedDayEvents) return null
    const dayEvts = getEventsForDate(selectedDayEvents)
    const d = new Date(selectedDayEvents + "T00:00:00")
    return (
      <div style={{ ...css.card, padding: 16, marginTop: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</h3>
            <span style={{ fontSize: 11, color: "#64748b" }}>{dayEvts.length} event{dayEvts.length !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => openAddForm(selectedDayEvents)} style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 11, padding: "6px 12px" }}>+ Add Event</button>
            <button onClick={() => setSelectedDayEvents(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer" }}><Icon name="x" size={16} /></button>
          </div>
        </div>
        {dayEvts.length === 0 ? (
          <p style={{ fontSize: 12, color: "#475569", margin: 0, textAlign: "center", padding: "16px 0" }}>No events scheduled for this day</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {dayEvts.sort((a, b) => a.time.localeCompare(b.time)).map(ev => (
              <div key={ev.id} onClick={() => openEditForm(ev)} style={{ padding: "10px 14px", borderRadius: 8, border: `1px solid ${ev.color}25`, background: `${ev.color}08`, cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18 }}>{typeIcons[ev.type] || "📌"}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{ev.title}</p>
                  {ev.description && <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0" }}>{ev.description}</p>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: 0 }}>{ev.time}</p>
                  <Badge color={statusColors[ev.status] || "#64748b"}>{statusLabels[ev.status] || ev.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {renderFormModal()}
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>Content Calendar</h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Schedule and manage your content publishing events</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, overflow: "hidden" }}>
            {(["month", "week", "day"] as const).map(v => (
              <button key={v} onClick={() => setCalView(v)} style={{ padding: "6px 14px", border: "none", background: calView === v ? "rgba(99,102,241,0.15)" : "transparent", color: calView === v ? "#c7d2fe" : "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{v}</button>
            ))}
          </div>
          <button onClick={() => openAddForm()} style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 12 }}>+ Add Event</button>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <button onClick={() => navigate(-1)} style={{ padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94a3b8", cursor: "pointer" }}><Icon name="chevLeft" size={13} /></button>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", minWidth: 200, textAlign: "center" }}>{headerLabel()}</span>
        <button onClick={() => navigate(1)} style={{ padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94a3b8", cursor: "pointer" }}><Icon name="chevRight" size={13} /></button>
        <button onClick={goToday} style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.08)", color: "#818cf8", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Today</button>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: "#475569" }}>{events.length} events total</span>
      </div>

      {/* Calendar View */}
      {calView === "month" && renderMonth()}
      {calView === "week" && renderWeek()}
      {calView === "day" && renderDay()}

      {/* Day detail panel for month view */}
      {calView === "month" && renderDayDetail()}

      {/* Legend */}
      <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {Object.entries(typeIcons).map(([k, icon]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11 }}>{icon}</span>
            <span style={{ fontSize: 10, color: "#475569", textTransform: "capitalize" }}>{k}</span>
          </div>
        ))}
        <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.06)" }} />
        {Object.entries(statusLabels).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: statusColors[k] || "#64748b" }} />
            <span style={{ fontSize: 10, color: "#475569" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
