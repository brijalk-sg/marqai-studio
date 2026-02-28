import { useState } from 'react'
import { Icon, Badge } from '../../components/ui'
import { css } from '../../lib/styles'
import { calendarItems } from '../../data/mockData'

export const Calendar = () => {
  const [calView, setCalView] = useState("week")
  const [calWeekOffset, setCalWeekOffset] = useState(0)

  const today = new Date(2026, 1, 28);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + calWeekOffset * 7);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const statusColors: Record<string, string> = { in_progress: "#6366f1", approval: "#f59e0b", scheduled: "#10b981", published: "#10b981", planning: "#64748b" };
  const statusLabel: Record<string, string> = { in_progress: "In Progress", approval: "Approval", scheduled: "Scheduled", published: "Published", planning: "Planning" };
  const typeIcons: Record<string, string> = { blog: "\u{1F4DD}", linkedin: "\u{1F4BC}", twitter: "\u{1F426}", video: "\u{1F3AC}", report: "\u{1F4CA}" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>Content Calendar</h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>AI-optimized publishing schedule - Updated daily by n8n cron</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, overflow: "hidden" }}>
            {["week", "2week"].map((v) => <button key={v} onClick={() => setCalView(v)} style={{ padding: "6px 13px", border: "none", background: calView === v ? "rgba(99,102,241,0.15)" : "transparent", color: calView === v ? "#c7d2fe" : "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{v === "week" ? "Week" : "2 Weeks"}</button>)}
          </div>
          <button style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 12 }}>+ Add Item</button>
        </div>
      </div>
      <div style={{ ...css.card, padding: "11px 16px", marginBottom: 14, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.12)", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 16 }}>{"\u{1F916}"}</span>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#c7d2fe" }}>AI Recommendation: </span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>Publish 'PCI DSS 4.0 Guide' this week — rising query trend (+42% impressions). Move 'FedNow Architecture Guide' earlier to capture March deadline traffic.</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button style={{ padding: "4px 10px", borderRadius: 5, border: "none", background: "rgba(99,102,241,0.15)", color: "#818cf8", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>Apply</button>
          <button style={{ padding: "4px 10px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#475569", fontSize: 10, cursor: "pointer" }}>Dismiss</button>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <button onClick={() => setCalWeekOffset(calWeekOffset - 1)} style={{ padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94a3b8", cursor: "pointer" }}><Icon name="chevLeft" size={13} /></button>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{months[days[0].getMonth()]} {days[0].getDate()} — {months[days[calView === "week" ? 6 : 13].getMonth()]} {days[calView === "week" ? 6 : 13].getDate()}, {days[0].getFullYear()}</span>
        <button onClick={() => setCalWeekOffset(calWeekOffset + 1)} style={{ padding: "5px 8px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94a3b8", cursor: "pointer" }}><Icon name="chevRight" size={13} /></button>
        <button onClick={() => setCalWeekOffset(0)} style={{ padding: "4px 9px", borderRadius: 5, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.08)", color: "#818cf8", fontSize: 10, fontWeight: 600, cursor: "pointer" }}>Today</button>
      </div>
      <div style={{ ...css.card, overflow: "hidden" }}>
        {[0, ...(calView === "2week" ? [7] : [])].map((weekOff) => (
          <div key={weekOff}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {days.slice(weekOff, weekOff + 7).map((day, i) => {
                const isToday = day.toDateString() === today.toDateString();
                return (
                  <div key={i} style={{ padding: "8px 10px", borderRight: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none", textAlign: "center" }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", marginBottom: 2 }}>{dayNames[day.getDay()]}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: isToday ? "#818cf8" : "#94a3b8", width: 26, height: 26, borderRadius: 7, background: isToday ? "rgba(99,102,241,0.15)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>{day.getDate()}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", minHeight: 130, borderBottom: calView === "2week" && weekOff === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              {Array.from({ length: 7 }, (_, di) => {
                const items = calendarItems.filter((item) => item.day === di + weekOff);
                return (
                  <div key={di} style={{ padding: "6px 5px", borderRight: di < 6 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    {items.map((item) => (
                      <div key={item.id} style={{ padding: "5px 7px", borderRadius: 5, border: `1px solid ${item.color}22`, background: `${item.color}10`, marginBottom: 4, cursor: "pointer" }}>
                        <div style={{ fontSize: 9, marginBottom: 1 }}>{typeIcons[item.type]}</div>
                        <p style={{ fontSize: 9, fontWeight: 600, color: "#e2e8f0", margin: "0 0 2px", lineHeight: 1.3 }}>{item.title}</p>
                        <Badge color={statusColors[item.status]}>{statusLabel[item.status]}</Badge>
                      </div>
                    ))}
                    <button style={{ width: "100%", padding: "3px", borderRadius: 4, border: "1px dashed rgba(255,255,255,0.06)", background: "transparent", color: "#334155", fontSize: 9, cursor: "pointer" }}>+</button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
        {Object.entries(statusLabel).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: statusColors[k] || "#64748b" }} />
            <span style={{ fontSize: 10, color: "#475569" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
