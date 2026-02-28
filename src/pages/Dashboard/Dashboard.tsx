import { useRole } from '../../context/RoleContext'
import { Badge, StatCard } from '../../components/ui'
import { css } from '../../lib/styles'

const adminKpis = [
  { label: "Total Published", value: "47", change: "+8 this month", color: "#10b981", icon: "📄" },
  { label: "Avg EEAT Score", value: "7.8", change: "+0.4 vs last month", color: "#818cf8", icon: "🎯" },
  { label: "Pipeline Velocity", value: "3.2d", change: "avg days to publish", color: "#3b82f6", icon: "⚡" },
  { label: "Pending Approvals", value: "4", change: "2 urgent", color: "#f59e0b", icon: "📋" },
]

const seoKpis = [
  { label: "Keywords Tracked", value: "24", change: "+3 new this week", color: "#10b981", icon: "🔑" },
  { label: "Avg Position", value: "12.4", change: "↑ 2.1 improvement", color: "#818cf8", icon: "📈" },
  { label: "Decay Alerts", value: "3", change: "1 critical", color: "#ef4444", icon: "⚠️" },
  { label: "Today's Priorities", value: "5", change: "2 protect, 2 capture", color: "#f59e0b", icon: "🎯" },
]

const priorities = [
  { type: "PROTECT", title: "Refresh: AI Fraud Guide — Lost 5 Positions", effort: "2 hours", urgency: "do_today", color: "#ef4444" },
  { type: "CAPTURE", title: "Optimize: FedNow Guide Climbing to Page 1", effort: "1 hour", urgency: "do_today", color: "#10b981" },
  { type: "COMPETE", title: "Counter: Feedzai Published New Comparison", effort: "half day", urgency: "this_week", color: "#f59e0b" },
  { type: "OPTIMIZE", title: "CTR Fix: 'PCI DSS 4.0' — 4.2k Impressions, 1.1% CTR", effort: "30 min", urgency: "do_today", color: "#3b82f6" },
  { type: "CREATE", title: "New: 'Bank Fraud Detection Budget Template 2026'", effort: "half day", urgency: "this_week", color: "#8b5cf6" },
]

const keywords = [
  { kw: "AI fraud detection ROI", pos: 8, prev: 5, vol: "1,200", ctr: "3.5%", alert: true },
  { kw: "real-time payment fraud", pos: 6, prev: 9, vol: "3,100", ctr: "5.2%", alert: false },
  { kw: "PCI DSS 4.0 compliance", pos: 4, prev: 4, vol: "2,400", ctr: "4.2%", alert: false },
  { kw: "reduce false positives fraud", pos: 12, prev: 8, vol: "1,500", ctr: "1.8%", alert: true },
  { kw: "fraud detection comparison", pos: 15, prev: 18, vol: "900", ctr: "2.1%", alert: false },
]

const approvals = [
  { title: "AI Fraud Detection ROI Guide", by: "Jordan Kim", eeat: 8.3, uplift: "+2.4K visits/mo" },
  { title: "PCI DSS 4.0 Compliance Checklist", by: "Jordan Kim", eeat: 7.8, uplift: "+1.8K visits/mo" },
  { title: "FedNow Architecture Blueprint", by: "Alex Rivera", eeat: 7.5, uplift: "+3.1K visits/mo" },
  { title: "False Positive Reduction Playbook", by: "Jordan Kim", eeat: 8.1, uplift: "+1.2K visits/mo" },
]

function getChangeColor(change: number): string {
  if (change > 0) return "#10b981"
  if (change < 0) return "#ef4444"
  return "#475569"
}

function getChangeIndicator(change: number): string {
  if (change > 0) return "↑"
  if (change < 0) return "↓"
  return "—"
}

export const Dashboard = () => {
  const { role } = useRole()

  return (
    <div>
      <div style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>
          {role === "admin" ? "Executive Overview" : "SEO Command Center"}
        </h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
          {role === "admin" ? "Content performance & team productivity" : "Keywords, priorities & pipeline status"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
        {(role === "admin" ? adminKpis : seoKpis).map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>

      {role === "seo_exec" && (
        <div style={{ ...css.card, padding: 18, marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 16 }}>🎯</span>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Today's AI Priorities</h2>
            </div>
            <span style={{ fontSize: 11, color: "#475569" }}>Updated 3h ago</span>
          </div>
          {priorities.map((p, i) => (
            <div key={p.type} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: i === 0 ? "rgba(239,68,68,0.04)" : "rgba(255,255,255,0.01)", border: `1px solid ${i === 0 ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)"}`, marginBottom: 5 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#334155", width: 18, textAlign: "center" }}>{i + 1}</span>
              <Badge color={p.color}>{p.type}</Badge>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0, flex: 1 }}>{p.title}</p>
              <Badge color="#94a3b8">{p.effort}</Badge>
              <Badge color={p.urgency === "do_today" ? "#ef4444" : "#f59e0b"}>{p.urgency.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
      )}

      <div style={{ ...css.card, padding: 18 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 12px" }}>
          {role === "admin" ? "📋 Pending Approvals" : "📊 Keyword Rankings"}
        </h2>
        {role === "seo_exec" ? (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.5fr", padding: "7px 10px", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span>Keyword</span><span>Position</span><span>Change</span><span>Volume</span><span>CTR</span><span>Alert</span>
            </div>
            {keywords.map((kw) => {
              const change = kw.prev - kw.pos
              return (
                <div key={kw.kw} style={{ display: "grid", gridTemplateColumns: "2fr 0.7fr 0.7fr 0.7fr 0.7fr 0.5fr", padding: "9px 10px", borderBottom: "1px solid rgba(255,255,255,0.03)", alignItems: "center", fontSize: 12 }}>
                  <span style={{ fontWeight: 500, color: "#e2e8f0" }}>{kw.kw}</span>
                  <span style={{ fontWeight: 700, color: "#f1f5f9" }}>{kw.pos}</span>
                  <span style={{ fontWeight: 600, color: getChangeColor(change) }}>{getChangeIndicator(change)}{Math.abs(change) || ""}</span>
                  <span style={{ color: "#94a3b8" }}>{kw.vol}</span>
                  <span style={{ color: "#94a3b8" }}>{kw.ctr}</span>
                  <span>{kw.alert ? <Badge color="#ef4444">DECAY</Badge> : <span style={{ color: "#334155" }}>—</span>}</span>
                </div>
              )
            })}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {approvals.map((item) => (
              <div key={item.title} style={{ ...css.card, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8 }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{item.title}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>by {item.by} · Predicted: {item.uplift}</p>
                </div>
                <Badge color="#818cf8">EEAT {item.eeat}</Badge>
                <button style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "rgba(16,185,129,0.1)", color: "#10b981", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Approve</button>
                <button style={{ padding: "5px 12px", borderRadius: 6, border: "none", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Reject</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
