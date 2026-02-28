import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Badge } from '../../components/ui'
import { css } from '../../lib/styles'
import { topics, strategy, researchSummary, intentColor, stageColor, diffColor, diffNum } from '../../data/mockData'

export const Research = () => {
  const navigate = useNavigate()

  const [researchPhase, setResearchPhase] = useState("input")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("")
  const [selectedTopics, setSelectedTopics] = useState<number[]>([])
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null)
  const [topicTab, setTopicTab] = useState("keywords")
  const [showStrategy, setShowStrategy] = useState(false)
  const [filterIntent, setFilterIntent] = useState("all")
  const [filterStage, setFilterStage] = useState("all")
  const [sortBy, setSortBy] = useState("recommended")
  const [formData, setFormData] = useState({
    niche: "AI-powered fintech solutions for fraud detection",
    goals: "Drive organic traffic and generate qualified leads for our AI fraud detection platform targeting mid-market banks",
    target_audience: "VP of Risk, Compliance Officers, and CTOs at mid-market banks and credit unions",
    competitors: ["featurespace.com/blog", "feedzai.com/resources", "sift.com/blog"],
    content_types: ["blog", "linkedin"],
    region: "US",
  })
  const [compInput, setCompInput] = useState("")

  const filteredTopics = topics
    .filter((t) => filterIntent === "all" || t.intent === filterIntent)
    .filter((t) => filterStage === "all" || t.stage === filterStage)
    .sort((a, b) => {
      if (sortBy === "recommended") return strategy.order.indexOf(a.id) - strategy.order.indexOf(b.id);
      if (sortBy === "difficulty") return diffNum(a.difficulty) - diffNum(b.difficulty);
      return 0;
    });

  const startResearch = () => {
    setResearchPhase("loading"); setLoadingProgress(0);
    const stages = [{ p: 15, s: "Analyzing niche landscape..." }, { p: 35, s: "Researching trending topics & SERP data..." }, { p: 55, s: "Generating keyword clusters..." }, { p: 75, s: "Running competitor content analysis..." }, { p: 90, s: "Building strategic recommendations..." }, { p: 100, s: "Research complete!" }];
    stages.forEach((st, i) => { setTimeout(() => { setLoadingProgress(st.p); setLoadingStage(st.s); if (st.p === 100) setTimeout(() => setResearchPhase("results"), 500); }, (i + 1) * 1100); });
  };

  if (researchPhase === "loading") return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh" }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 15, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>🧠</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 5px" }}>AI is Researching</h2>
        <p style={{ fontSize: 13, color: "#818cf8", fontWeight: 600, margin: "0 0 18px" }}>{loadingStage}</p>
        <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${loadingProgress}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: 3, transition: "width 0.6s ease" }} />
        </div>
        <p style={{ fontSize: 11, color: "#475569" }}>{loadingProgress}%</p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 5, textAlign: "left" }}>
          {["Topic Research", "Keyword Analysis", "Competitor Analysis", "Strategy Building", "Saving Results"].map((st, i) => {
            const threshold = (i + 1) * 15;
            const done = loadingProgress >= threshold + 15;
            const active = loadingProgress >= threshold && !done;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 10px", borderRadius: 6, background: done ? "rgba(16,185,129,0.04)" : active ? "rgba(99,102,241,0.04)" : "transparent" }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, border: `1px solid ${done ? "#10b98130" : active ? "#6366f130" : "rgba(255,255,255,0.06)"}`, background: done ? "rgba(16,185,129,0.1)" : active ? "rgba(99,102,241,0.1)" : "transparent", color: done ? "#10b981" : active ? "#818cf8" : "#334155" }}>{done ? "✓" : active ? "●" : i + 1}</div>
                <span style={{ fontSize: 12, color: done || active ? "#e2e8f0" : "#475569" }}>{st}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )

  if (researchPhase === "results") return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: 0 }}>Research Results</h1>
            <Badge color="#10b981">✓ Complete</Badge>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>AI found {topics.length} high-opportunity topics. Select to generate content.</p>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={() => setShowStrategy(!showStrategy)} style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.06)", color: "#fcd34d", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{showStrategy ? "Hide" : "📋"} Strategy</button>
          <button onClick={() => setResearchPhase("input")} style={{ padding: "7px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", color: "#94a3b8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>← New Research</button>
        </div>
      </div>
      {/* Research Summary */}
      <div style={{ ...css.card, border: "1px solid rgba(99,102,241,0.1)", padding: 16, marginBottom: 12 }}>
        <h3 style={{ fontSize: 12, fontWeight: 700, color: "#818cf8", margin: "0 0 9px" }}>🔬 Research Summary</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[{ l: "Niche Analysis", t: researchSummary.niche, i: "🏢" }, { l: "Opportunity", t: researchSummary.opportunity, i: "🎯" }, { l: "Strategy", t: researchSummary.direction, i: "🧭" }].map((item, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 7, padding: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", margin: "0 0 3px" }}>{item.i} {item.l}</p>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{item.t}</p>
            </div>
          ))}
        </div>
      </div>
      {/* Strategy panel */}
      {showStrategy && (
        <div style={{ ...css.card, border: "1px solid rgba(245,158,11,0.1)", padding: 16, marginBottom: 12 }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, color: "#fcd34d", margin: "0 0 8px" }}>📋 Publishing Strategy</h3>
          <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: "0 0 10px" }}>{strategy.reasoning}</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            <div style={{ background: "rgba(16,185,129,0.04)", borderRadius: 7, padding: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#10b981", margin: "0 0 5px", textTransform: "uppercase" }}>⚡ Quick Wins</p>
              {strategy.quickWins.map((id) => <p key={id} style={{ fontSize: 11, color: "#cbd5e1", margin: "2px 0" }}>#{id} {topics.find((t) => t.id === id)?.title.split(":")[0]}</p>)}
            </div>
            <div style={{ background: "rgba(99,102,241,0.04)", borderRadius: 7, padding: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", margin: "0 0 5px", textTransform: "uppercase" }}>🏆 Strongest</p>
              {strategy.strongest.map((id) => <p key={id} style={{ fontSize: 11, color: "#cbd5e1", margin: "2px 0" }}>#{id} {topics.find((t) => t.id === id)?.title.split(":")[0]}</p>)}
            </div>
            <div style={{ background: "rgba(245,158,11,0.04)", borderRadius: 7, padding: 10 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#fcd34d", margin: "0 0 5px", textTransform: "uppercase" }}>🎯 Recommended Order</p>
              {strategy.order.map((id, i) => <p key={id} style={{ fontSize: 11, color: "#cbd5e1", margin: "2px 0" }}>{i + 1}. {topics.find((t) => t.id === id)?.title.split(":")[0]}</p>)}
            </div>
          </div>
        </div>
      )}
      {/* Filters */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          <select value={filterIntent} onChange={(e) => setFilterIntent(e.target.value)} style={css.select}><option value="all">All Intents</option><option value="informational">Informational</option><option value="commercial">Commercial</option></select>
          <select value={filterStage} onChange={(e) => setFilterStage(e.target.value)} style={css.select}><option value="all">All Stages</option><option value="awareness">Awareness</option><option value="consideration">Consideration</option><option value="decision">Decision</option></select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={css.select}><option value="recommended">AI Recommended</option><option value="difficulty">Easiest First</option></select>
        </div>
        {selectedTopics.length > 0 && <button onClick={() => navigate('/content-studio')} style={{ ...css.btn, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", border: "none" }}>Generate Content ({selectedTopics.length}) <Icon name="arrowRight" size={13} color="#fff" /></button>}
      </div>
      {/* Topic cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {filteredTopics.map((topic) => {
          const isExp = expandedTopic === topic.id, isSel = selectedTopics.includes(topic.id), rank = strategy.order.indexOf(topic.id), isQW = strategy.quickWins.includes(topic.id);
          return (
            <div key={topic.id} style={{ ...css.card, border: `1px solid ${isSel ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)"}`, background: isSel ? "rgba(99,102,241,0.03)" : "rgba(255,255,255,0.015)", overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div onClick={() => setSelectedTopics((p) => p.includes(topic.id) ? p.filter((x) => x !== topic.id) : [...p, topic.id])} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${isSel ? "#6366f1" : "rgba(255,255,255,0.15)"}`, background: isSel ? "#6366f1" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginTop: 1, flexShrink: 0, transition: "all 0.15s" }}>
                  {isSel && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, flexWrap: "wrap" }}>
                    {rank >= 0 && <Badge color="#a78bfa">#{rank + 1}</Badge>}
                    {isQW && <Badge color="#10b981">⚡ QUICK WIN</Badge>}
                    <Badge color={intentColor(topic.intent)}>{topic.intent}</Badge>
                    <Badge color={stageColor(topic.stage)}>{topic.stage}</Badge>
                    <Badge color={diffColor(topic.difficulty)}>{topic.difficulty}</Badge>
                  </div>
                  <h3 onClick={() => setExpandedTopic(isExp ? null : topic.id)} style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 3px", cursor: "pointer" }}>{topic.title}</h3>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 5px", lineHeight: 1.4 }}>{topic.why}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, color: "#64748b" }}>
                    <span>🔑 <strong style={{ color: "#cbd5e1" }}>{topic.primary_keyword}</strong></span>
                    <span>📊 {topic.volume}/mo</span>
                    <span>📁 {topic.format}</span>
                  </div>
                </div>
                <button onClick={() => setExpandedTopic(isExp ? null : topic.id)} style={{ padding: 5, borderRadius: 5, border: "none", background: "transparent", color: "#475569", cursor: "pointer", transform: isExp ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <Icon name="chevDown" size={15} />
                </button>
              </div>
              {isExp && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    {["keywords", "competitor", "strategy"].map((tab) => (
                      <button key={tab} onClick={() => setTopicTab(tab)} style={{ padding: "9px 14px", border: "none", borderBottom: topicTab === tab ? "2px solid #6366f1" : "2px solid transparent", background: topicTab === tab ? "rgba(99,102,241,0.04)" : "transparent", color: topicTab === tab ? "#c7d2fe" : "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>
                        {tab === "keywords" ? "Keywords" : tab === "competitor" ? "Competitors" : "Strategy"}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding: 14 }}>
                    {topicTab === "keywords" && (
                      <div>
                        <div style={{ background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: 8, padding: "10px 14px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#818cf8", margin: "0 0 2px", textTransform: "uppercase" }}>Primary Keyword</p>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{topic.keywords.primary.kw}</p>
                          </div>
                          <div style={{ display: "flex", gap: 14, textAlign: "center" }}>
                            <div><p style={{ fontSize: 15, fontWeight: 800, color: "#10b981", margin: 0 }}>{topic.keywords.primary.vol}</p><p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>monthly</p></div>
                            <div><p style={{ fontSize: 15, fontWeight: 800, color: diffColor(topic.keywords.primary.diff < 35 ? "low" : topic.keywords.primary.diff < 50 ? "medium" : "high"), margin: 0 }}>{topic.keywords.primary.diff}</p><p style={{ fontSize: 9, color: "#64748b", margin: 0 }}>difficulty</p></div>
                          </div>
                        </div>
                        <div style={{ borderRadius: 7, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden", marginBottom: 10 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.7fr 0.7fr", padding: "6px 10px", background: "rgba(255,255,255,0.02)", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase" }}>
                            <span>Keyword</span><span>Volume</span><span>Diff</span><span>Rel</span>
                          </div>
                          {topic.keywords.secondary.map((kw, i) => (
                            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 0.7fr 0.7fr", padding: "7px 10px", borderTop: "1px solid rgba(255,255,255,0.03)", fontSize: 11, alignItems: "center" }}>
                              <span style={{ color: "#e2e8f0" }}>{kw.kw}</span>
                              <span style={{ color: "#94a3b8" }}>{kw.vol}</span>
                              <span style={{ color: diffColor(kw.diff < 30 ? "low" : kw.diff < 50 ? "medium" : "high"), fontWeight: 600 }}>{kw.diff}</span>
                              <Badge color={kw.rel === "high" ? "#10b981" : "#f59e0b"}>{kw.rel}</Badge>
                            </div>
                          ))}
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                          {[{ l: "LSI Keywords", items: topic.keywords.lsi, c: "#6366f1" }, { l: "Entities", items: topic.keywords.entity, c: "#10b981" }].map((g) => (
                            <div key={g.l} style={{ background: "rgba(255,255,255,0.02)", borderRadius: 7, border: "1px solid rgba(255,255,255,0.04)", padding: "9px 10px" }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: g.c, margin: "0 0 5px", textTransform: "uppercase" }}>{g.l}</p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                                {g.items.map((item, i) => <span key={i} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 4, background: `${g.c}0a`, border: `1px solid ${g.c}18`, color: g.c }}>{item}</span>)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div style={{ background: "rgba(245,158,11,0.03)", borderRadius: 7, border: "1px solid rgba(245,158,11,0.08)", padding: "9px 10px" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: "#fcd34d", margin: "0 0 5px", textTransform: "uppercase" }}>❓ People Also Ask</p>
                          {topic.keywords.questions.map((q, i) => <p key={i} style={{ fontSize: 11, color: "#cbd5e1", margin: "3px 0", paddingLeft: 8, borderLeft: "2px solid rgba(245,158,11,0.15)" }}>{q}</p>)}
                        </div>
                      </div>
                    )}
                    {topicTab === "competitor" && (
                      <div>
                        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                          {[{ l: "Competition", v: topic.competitor.level }, { l: "Content Type", v: topic.competitor.dominant }, { l: "Avg Length", v: topic.competitor.avgLen }].map((m) => (
                            <div key={m.l} style={{ flex: 1, background: "rgba(255,255,255,0.02)", borderRadius: 7, padding: 9, textAlign: "center" }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", margin: "0 0 2px", textTransform: "uppercase" }}>{m.l}</p>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", margin: 0, textTransform: "capitalize" }}>{m.v}</p>
                            </div>
                          ))}
                        </div>
                        {topic.competitor.top.map((c, i) => (
                          <div key={i} style={{ ...css.card, padding: 10, marginBottom: 7 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{c.domain}</span>
                              <Badge color={c.quality === "excellent" ? "#10b981" : "#3b82f6"}>{c.quality}</Badge>
                            </div>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 6px" }}>{c.approach}</p>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                              <div>{c.strengths.map((s, j) => <p key={j} style={{ fontSize: 10, color: "#10b981", margin: "1px 0" }}>+ {s}</p>)}</div>
                              <div>{c.weaknesses.map((w, j) => <p key={j} style={{ fontSize: 10, color: "#ef4444", margin: "1px 0" }}>− {w}</p>)}</div>
                            </div>
                          </div>
                        ))}
                        {topic.competitor.gaps.map((g, i) => (
                          <div key={i} style={{ background: "rgba(245,158,11,0.03)", borderRadius: 7, border: "1px solid rgba(245,158,11,0.08)", padding: "9px 10px", marginBottom: 5 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                              <span style={{ fontSize: 11, fontWeight: 600, color: "#fcd34d" }}>{g.gap}</span>
                              <Badge color="#ef4444">{g.impact} impact</Badge>
                            </div>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>→ {g.action}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {topicTab === "strategy" && (
                      <div style={{ background: "rgba(99,102,241,0.04)", borderRadius: 9, border: "1px solid rgba(99,102,241,0.1)", padding: 16 }}>
                        <h4 style={{ fontSize: 13, fontWeight: 700, color: "#c7d2fe", margin: "0 0 8px" }}>🏆 Winning Strategy</h4>
                        <p style={{ fontSize: 12, color: "#e2e8f0", margin: "0 0 12px", lineHeight: 1.5 }}><strong>Angle:</strong> {topic.competitor.strategy.angle}</p>
                        <div style={{ display: "flex", gap: 10 }}>
                          {[{ l: "Timeline", v: topic.competitor.strategy.timeline, c: "#10b981" }, { l: "Confidence", v: `${topic.competitor.strategy.confidence}/10`, c: "#818cf8" }, { l: "Format", v: topic.format, c: "#f59e0b" }].map((m) => (
                            <div key={m.l} style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 7, padding: 9, textAlign: "center" }}>
                              <p style={{ fontSize: 9, fontWeight: 700, color: "#475569", margin: "0 0 2px", textTransform: "uppercase" }}>{m.l}</p>
                              <p style={{ fontSize: 14, fontWeight: 800, color: m.c, margin: 0, textTransform: "capitalize" }}>{m.v}</p>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: "10px 0 0", lineHeight: 1.5 }}><strong style={{ color: "#c7d2fe" }}>Unique angle:</strong> {topic.angle}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {/* Sticky selection bar */}
      {selectedTopics.length > 0 && (
        <div style={{ position: "sticky", bottom: 0, marginTop: 12, padding: "12px 16px", background: "rgba(10,14,26,0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f1f5f9" }}>{selectedTopics.length} selected</span>
            {selectedTopics.map((id) => <Badge key={id} color="#818cf8">#{id}</Badge>)}
            <button onClick={() => setSelectedTopics([])} style={{ fontSize: 11, color: "#475569", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Clear</button>
          </div>
          <button onClick={() => navigate('/content-studio')} style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
            Proceed to Content Generation <Icon name="arrowRight" size={13} color="#fff" />
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: 740, margin: "0 auto" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>Research & Topic Discovery</h1>
        <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>AI analyzes your niche, finds trending topics, maps keywords, and identifies competitor gaps.</p>
      </div>
      <div style={{ ...css.card, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, padding: "10px 14px", borderRadius: 8, background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>1</div>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#c7d2fe", margin: 0 }}>Step 1 of 4 — Research & Topic Discovery</p>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>Generates strategic topics with keyword clusters and competitor analysis</p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Industry / Niche *</label>
            <input value={formData.niche} onChange={(e) => setFormData({ ...formData, niche: e.target.value })} style={css.input} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Content Goals *</label>
            <textarea value={formData.goals} onChange={(e) => setFormData({ ...formData, goals: e.target.value })} rows={2} style={{ ...css.input, resize: "vertical" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Target Audience *</label>
            <textarea value={formData.target_audience} onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })} rows={2} style={{ ...css.input, resize: "vertical" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Known Competitors</label>
              <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                <input value={compInput} onChange={(e) => setCompInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && compInput.trim()) { setFormData({ ...formData, competitors: [...formData.competitors, compInput.trim()] }); setCompInput(""); } }} placeholder="competitor.com" style={{ ...css.input, flex: 1 }} />
                <button onClick={() => { if (compInput.trim()) { setFormData({ ...formData, competitors: [...formData.competitors, compInput.trim()] }); setCompInput(""); } }} style={{ padding: "7px 12px", borderRadius: 7, border: "none", background: "rgba(99,102,241,0.12)", color: "#818cf8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Add</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {formData.competitors.map((c, i) => (
                  <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", fontSize: 11, color: "#c7d2fe" }}>
                    {c}<span onClick={() => setFormData({ ...formData, competitors: formData.competitors.filter((_, idx) => idx !== i) })} style={{ cursor: "pointer", opacity: 0.5, fontSize: 10 }}>✕</span>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Content Types</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                {["blog", "linkedin", "twitter", "video"].map((t) => {
                  const on = formData.content_types.includes(t);
                  return <button key={t} onClick={() => setFormData({ ...formData, content_types: on ? formData.content_types.filter((x) => x !== t) : [...formData.content_types, t] })} style={{ padding: "5px 10px", borderRadius: 6, border: on ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(255,255,255,0.08)", background: on ? "rgba(99,102,241,0.1)" : "transparent", color: on ? "#c7d2fe" : "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>;
                })}
              </div>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>Region</label>
              <select value={formData.region} onChange={(e) => setFormData({ ...formData, region: e.target.value })} style={{ ...css.input }}>
                <option value="US">United States</option><option value="UK">United Kingdom</option><option value="EU">Europe</option><option value="Global">Global</option>
              </select>
            </div>
          </div>
          <button onClick={startResearch} style={{ padding: "13px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Icon name="search" size={16} color="#fff" /> Generate AI Research & Topics
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "#475569", margin: 0 }}>Powered by Claude AI — typically takes 30-45 seconds</p>
        </div>
      </div>
    </div>
  )
}
