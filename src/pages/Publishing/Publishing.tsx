import { useState } from "react";
import { Badge } from "../../components/ui";
import { css } from "../../lib/styles";

const channels = [
  { id: "wordpress", label: "WordPress", icon: "\u{1F310}", color: "#3b82f6", connected: true },
  { id: "linkedin", label: "LinkedIn", icon: "\u{1F4BC}", color: "#0077b5", connected: true },
  { id: "twitter", label: "Twitter / X", icon: "\u{1F426}", color: "#1da1f2", connected: false },
  { id: "youtube", label: "YouTube", icon: "\u{1F4FA}", color: "#ef4444", connected: false },
];

const publishQueue = [
  { id: "cb-002", title: "PCI DSS 4.0 and AI: What Your Fraud Team Needs to Know", eeat: 8.3, status: "approved", scheduledFor: "Today 2:00 PM" },
  { id: "cb-004", title: "Real-Time Payment Fraud Detection: Architecture Guide", eeat: 7.6, status: "ready", scheduledFor: "Mar 5, 2026" },
];

const publishHistory = [
  { id: "cb-003", title: "Featurespace vs Feedzai vs Sift: AI Fraud Detection Compared", publishedOn: "Feb 22, 2026", channels: ["wordpress", "linkedin"], views: 342, clicks: 28 },
];

export const Publishing = () => {
  const [pubTab, setPubTab] = useState("queue");
  const [selectedChannels, setSelectedChannels] = useState(["linkedin", "wordpress"]);
  const [publishing, setPublishing] = useState<string | null>(null);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>Publishing Hub</h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Multi-channel publishing powered by n8n workflow automation</p>
        </div>
        <div style={{ display: "flex", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, overflow: "hidden" }}>
          {["queue", "history"].map((t) => (
            <button
              key={t}
              onClick={() => setPubTab(t)}
              style={{
                padding: "6px 16px",
                border: "none",
                background: pubTab === t ? "rgba(99,102,241,0.15)" : "transparent",
                color: pubTab === t ? "#c7d2fe" : "#64748b",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {t === "queue" ? "\u{1F4E4} Queue" : "\u{1F4CB} History"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        {channels.map((ch) => (
          <div key={ch.id} style={{ ...css.card, padding: 12, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ fontSize: 18 }}>{ch.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: "0 0 2px" }}>{ch.label}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: ch.connected ? "#10b981" : "#ef4444" }} />
                <span style={{ fontSize: 9, color: ch.connected ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                  {ch.connected ? "Connected" : "Not connected"}
                </span>
              </div>
            </div>
            {!ch.connected && (
              <button
                style={{
                  padding: "3px 7px",
                  borderRadius: 4,
                  border: "1px solid rgba(99,102,241,0.2)",
                  background: "rgba(99,102,241,0.08)",
                  color: "#818cf8",
                  fontSize: 9,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Connect
              </button>
            )}
          </div>
        ))}
      </div>

      {pubTab === "queue" &&
        publishQueue.map((item) => (
          <div key={item.id} style={{ ...css.card, padding: 18, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1, marginRight: 14 }}>
                <div style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 5 }}>
                  <Badge color={item.status === "approved" ? "#10b981" : "#6366f1"}>
                    {item.status === "approved" ? "\u2705 Approved" : "Ready"}
                  </Badge>
                  <span style={{ fontSize: 10, color: "#475569" }}>
                    EEAT {item.eeat}/10 \u00B7 {item.scheduledFor}
                  </span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{item.title}</h3>
              </div>
              <button
                onClick={() => {
                  setPublishing(item.id);
                  setTimeout(() => setPublishing(null), 3000);
                }}
                disabled={publishing === item.id}
                style={{
                  ...css.btn,
                  border: "none",
                  background: publishing === item.id ? "rgba(16,185,129,0.3)" : "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {publishing === item.id ? "\u{1F680} Publishing..." : "\u{1F680} Publish Now"}
              </button>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", margin: "0 0 7px" }}>
                Publish to Channels
              </p>
              <div style={{ display: "flex", gap: 7 }}>
                {channels.map((ch) => {
                  const isSel = selectedChannels.includes(ch.id);
                  return (
                    <button
                      key={ch.id}
                      disabled={!ch.connected}
                      onClick={() =>
                        setSelectedChannels(
                          isSel ? selectedChannels.filter((c) => c !== ch.id) : [...selectedChannels, ch.id]
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "6px 11px",
                        borderRadius: 6,
                        border: `1px solid ${isSel && ch.connected ? ch.color + "40" : "rgba(255,255,255,0.06)"}`,
                        background: isSel && ch.connected ? `${ch.color}15` : "rgba(255,255,255,0.02)",
                        color: isSel && ch.connected ? "#e2e8f0" : "#475569",
                        fontSize: 11,
                        cursor: ch.connected ? "pointer" : "not-allowed",
                        opacity: ch.connected ? 1 : 0.4,
                      }}
                    >
                      <span>{ch.icon}</span>
                      <span>{ch.label}</span>
                      {isSel && ch.connected && <span style={{ color: "#10b981" }}>{"\u2713"}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {publishing === item.id && (
              <div
                style={{
                  marginTop: 10,
                  padding: "10px 12px",
                  borderRadius: 7,
                  background: "rgba(16,185,129,0.04)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <p style={{ fontSize: 11, color: "#6ee7b7", fontWeight: 600, margin: "0 0 7px" }}>
                  {"\u{1F916}"} n8n Publishing Pipeline Active
                </p>
                {[
                  "Fetching content from MongoDB...",
                  "Adapting for LinkedIn (300 words)...",
                  "Creating WordPress draft via REST API...",
                  "Updating status in database...",
                ].map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 7, alignItems: "center", marginBottom: 3 }}>
                    <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#10b981", flexShrink: 0 }} />
                    <span style={{ fontSize: 10, color: "#64748b" }}>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

      {pubTab === "history" && (
        <div style={{ ...css.card, overflow: "hidden" }}>
          <div
            style={{
              padding: "10px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 0.7fr 0.7fr",
              fontSize: 10,
              fontWeight: 700,
              color: "#475569",
              textTransform: "uppercase",
            }}
          >
            <span>Title</span>
            <span>Published</span>
            <span>Channels</span>
            <span>Views</span>
            <span>Clicks</span>
          </div>
          {publishHistory.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "12px 18px",
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 0.7fr 0.7fr",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{item.title}</p>
              <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.publishedOn}</span>
              <div style={{ display: "flex", gap: 3 }}>
                {item.channels.map((c) => (
                  <span key={c} style={{ fontSize: 14 }}>
                    {channels.find((ch) => ch.id === c)?.icon}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9" }}>{item.views}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{item.clicks}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
