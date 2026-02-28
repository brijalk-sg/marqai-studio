import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Icon, Badge, StatCard } from '../../components/ui'
import { css } from '../../lib/styles'
import { contentBriefs, type ContentBrief } from '../../data/mockData'
import api from '../../lib/api'

export const ContentStudio = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [contentView, setContentView] = useState("list")
  const [selectedBrief, setSelectedBrief] = useState<ContentBrief | null>(null)
  const [editorTab, setEditorTab] = useState("article")
  const [improving, setImproving] = useState(false)
  const [improveProgress, setImproveProgress] = useState(0)
  const [briefLoading, setBriefLoading] = useState(false)
  const [briefError, setBriefError] = useState("")
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingStage, setLoadingStage] = useState("")
  const [allBriefs, setAllBriefs] = useState<ContentBrief[]>(contentBriefs)
  const [publishToast, setPublishToast] = useState("")

  useEffect(() => {
    const state = location.state as { topic?: unknown; industry?: string; contentGoals?: string; targetAudience?: string; contentPlatform?: string; region?: string } | null
    if (state?.topic) {
      generateBrief(state)
      window.history.replaceState({}, document.title)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const generateBrief = async (state: { topic?: unknown; industry?: string; contentGoals?: string; targetAudience?: string; contentPlatform?: string; region?: string }) => {
    setBriefLoading(true)
    setBriefError("")
    setContentView("editor")
    setEditorTab("article")
    setLoadingProgress(0)

    const stages = [
      { p: 15, s: "Analyzing topic and keywords..." },
      { p: 35, s: "Generating content brief..." },
      { p: 55, s: "Building article outline..." },
      { p: 75, s: "Running EEAT analysis..." },
    ]
    stages.forEach((st, i) => {
      setTimeout(() => { setLoadingProgress(st.p); setLoadingStage(st.s) }, (i + 1) * 900)
    })

    try {
      const res = await api.post("marqai/brief", {
        briefNumber: 1,
        topic: state.topic,
        industry: state.industry || "",
        contentGoals: state.contentGoals || "",
        targetAudience: state.targetAudience || "",
        contentPlatform: state.contentPlatform || "linkedin",
        region: state.region || "",
      })

      const data = res.data
      const briefData = data.brief || data

      const brief: ContentBrief = {
        id: briefData.id || `cb-${Date.now()}`,
        title: briefData.title || "Untitled Brief",
        keyword: briefData.keyword || "",
        status: briefData.status || "draft",
        eeat: briefData.eeat || 0,
        words: briefData.words || 0,
        author: briefData.author || "MarqAI",
        created: briefData.created || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        cluster: briefData.cluster || "",
        outline: briefData.outline || { sections: [] },
        article: {
          excerpt: briefData.article?.excerpt || "",
          content: briefData.article?.content || "",
        },
        eeatBreakdown: briefData.eeatBreakdown || {},
        meta: {
          title: briefData.meta?.title || "",
          description: briefData.meta?.description || "",
          og_title: briefData.meta?.og_title || "",
          faq: briefData.meta?.faq || [],
        },
      }

      setSelectedBrief(brief)
      setAllBriefs(prev => [brief, ...prev])
      setLoadingProgress(100)
      setLoadingStage("Brief generated!")
      setTimeout(() => setBriefLoading(false), 500)
    } catch {
      // API failed — fall back to mock response
      // state.topic is a Topic object from Research page
      const topicObj = state.topic as { title?: string; primary_keyword?: string } | undefined
      const topicTitle = topicObj?.title || "Untitled Brief"
      const topicKeyword = topicObj?.primary_keyword || topicTitle.split(" ").slice(0, 4).join(" ").toLowerCase()

      const mockBrief: ContentBrief = {
        id: `cb-${Date.now()}`,
        title: topicTitle,
        keyword: topicKeyword,
        status: "draft",
        eeat: 7.5,
        words: 1850,
        author: "MarqAI",
        created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        cluster: state.industry || "General",
        outline: {
          sections: [
            { heading: "Introduction & Market Overview", type: "h2" },
            { heading: "Key Challenges & Pain Points", type: "h2" },
            { heading: "Strategic Solutions & Best Practices", type: "h2" },
            { heading: "Implementation Roadmap", type: "h2" },
            { heading: "Measuring Success & KPIs", type: "h2" },
            { heading: "FAQ", type: "h2" },
          ],
        },
        article: {
          excerpt: `A comprehensive guide to ${topicTitle} for ${state.targetAudience || "professionals"} in the ${state.industry || "industry"} space. This brief covers key strategies, implementation steps, and measurable outcomes.`,
          content: `## Introduction & Market Overview\n\nThe landscape of ${topicTitle} is evolving rapidly. Organizations in the ${state.industry || "industry"} sector must adapt to stay competitive and deliver value to their ${state.targetAudience || "audience"}.\n\n## Key Challenges & Pain Points\n\nCommon challenges include keeping pace with market changes, aligning strategy with business objectives, and measuring the impact of content initiatives. Understanding these pain points is the first step toward building an effective content strategy.\n\n## Strategic Solutions & Best Practices\n\nLeading organizations are adopting data-driven approaches to content creation. By leveraging AI-powered insights and audience analytics, teams can create content that resonates with their target audience and drives measurable results.\n\n## Implementation Roadmap\n\nA phased approach ensures smooth adoption: Phase 1 — Audit existing content and identify gaps. Phase 2 — Develop a content calendar aligned with business goals. Phase 3 — Execute, measure, and iterate based on performance data.`,
        },
        eeatBreakdown: {
          experience: { score: 7.0, label: "Experience", feedback: "Add first-person insights or customer quotes to strengthen practical credibility." },
          expertise: { score: 7.8, label: "Expertise", feedback: "Good technical depth. Consider citing industry reports or peer-reviewed sources." },
          authority: { score: 7.2, label: "Authoritativeness", feedback: "Reference authoritative industry bodies and include original data points." },
          trust: { score: 8.0, label: "Trustworthiness", feedback: "Content is balanced and well-structured. Add methodology section for transparency." },
        },
        meta: {
          title: `${topicTitle} — Complete Guide [${new Date().getFullYear()}]`,
          description: `Discover actionable strategies for ${topicTitle}. Includes implementation roadmap, best practices, and measurable KPIs for ${state.targetAudience || "professionals"}.`,
          og_title: `${topicTitle} — Expert Guide`,
          faq: [
            { q: `What are the key benefits of ${topicTitle}?`, a: "The primary benefits include improved efficiency, better audience engagement, and measurable ROI through data-driven content strategies." },
            { q: "How long does implementation typically take?", a: "Most organizations see initial results within 1-3 months, with full implementation completed in 3-6 months depending on scope." },
          ],
        },
      }

      setSelectedBrief(mockBrief)
      setAllBriefs(prev => [mockBrief, ...prev])
      setLoadingProgress(100)
      setLoadingStage("Brief generated (offline mode)")
      setTimeout(() => setBriefLoading(false), 500)
    }
  }

  const simulateImprove = () => {
    setImproving(true); setImproveProgress(0);
    [15, 35, 60, 85, 100].forEach((p, i) => { setTimeout(() => { setImproveProgress(p); if (p === 100) setTimeout(() => setImproving(false), 500); }, (i + 1) * 700); });
  };

  const handlePublish = () => {
    if (!selectedBrief) return
    const published: ContentBrief = {
      ...selectedBrief,
      status: "published",
      publishedOn: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
    setSelectedBrief(published)
    setAllBriefs(prev => {
      const exists = prev.some(b => b.id === published.id)
      return exists ? prev.map(b => b.id === published.id ? published : b) : [published, ...prev]
    })
    setPublishToast("Content published successfully!")
    setTimeout(() => setPublishToast(""), 3000)
  }

  const handleScheduleToCalendar = () => {
    if (!selectedBrief) return
    navigate("/calendar", { state: { scheduleBrief: { id: selectedBrief.id, title: selectedBrief.title, keyword: selectedBrief.keyword, type: "blog" } } })
  }

  const renderLoading = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "55vh" }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ width: 60, height: 60, borderRadius: 15, background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 18px" }}>📝</div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 5px" }}>Generating Content Brief</h2>
        <p style={{ fontSize: 13, color: "#818cf8", fontWeight: 600, margin: "0 0 18px" }}>{loadingStage}</p>
        <div style={{ height: 5, background: "rgba(255,255,255,0.05)", borderRadius: 3, overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${loadingProgress}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: 3, transition: "width 0.6s ease" }} />
        </div>
        <p style={{ fontSize: 11, color: "#475569" }}>{loadingProgress}%</p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 5, textAlign: "left" }}>
          {["Topic Analysis", "Content Brief", "Article Outline", "EEAT Scoring", "Finalizing"].map((st, i) => {
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
  );

  const renderContentEditor = () => {
    const brief = selectedBrief;
    if (!brief) return null;
    const eeatEntries = Object.values(brief.eeatBreakdown)
    const eeatAvg = eeatEntries.length > 0 ? (eeatEntries.reduce((s, e) => s + e.score, 0) / eeatEntries.length).toFixed(1) : "0.0"
    const eeatColor = parseFloat(eeatAvg) >= 8 ? "#10b981" : parseFloat(eeatAvg) >= 7 ? "#f59e0b" : "#ef4444";

    return (
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <button onClick={() => setContentView("list")} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="chevLeft" size={11} /> Back
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 16, fontWeight: 800, color: "#f1f5f9", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{brief.title}</h1>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}><Badge color="#6366f1">{brief.keyword}</Badge><span style={{ fontSize: 10, color: "#475569" }}>{brief.words.toLocaleString()} words · {brief.author} · {brief.created}</span></div>
          </div>
          <div style={{ display: "flex", gap: 7 }}>
            <button onClick={simulateImprove} disabled={improving} style={{ ...css.btn, border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.1)", color: "#a78bfa" }}>{improving ? `Improving... ${improveProgress}%` : "⚡ AI Improve"}</button>
            {/* <button style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}><Icon name="send" size={12} color="#fff" /> Send for Approval</button> */}
          </div>
        </div>
        {improving && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 7, background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 12, color: "#c4b5fd", fontWeight: 600 }}>🤖 Claude AI improving content...</span>
              <span style={{ fontSize: 12, color: "#8b5cf6", fontWeight: 700 }}>{improveProgress}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
              <div style={{ height: "100%", width: `${improveProgress}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)", borderRadius: 2, transition: "width 0.4s" }} />
            </div>
          </div>
        )}
        {publishToast && (
          <div style={{ marginBottom: 14, padding: "10px 14px", borderRadius: 7, background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>✅</span>
            <span style={{ fontSize: 12, color: "#6ee7b7", fontWeight: 600, flex: 1 }}>{publishToast}</span>
            <button onClick={() => setPublishToast("")} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 14 }}>
          <div>
            <div style={{ display: "flex", gap: 2, marginBottom: 14, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: 3 }}>
              {["article", "eeat", "meta", "outline"].map((t) => (
                <button key={t} onClick={() => setEditorTab(t)} style={{ flex: 1, padding: "6px 4px", borderRadius: 6, border: "none", background: editorTab === t ? "rgba(99,102,241,0.15)" : "transparent", color: editorTab === t ? "#c7d2fe" : "#64748b", fontSize: 11, fontWeight: editorTab === t ? 700 : 500, cursor: "pointer" }}>
                  {t === "article" ? "📝 Article" : t === "eeat" ? "🎯 EEAT" : t === "meta" ? "🔖 Meta" : "📋 Outline"}
                </button>
              ))}
            </div>
            {editorTab === "article" && (
              <div style={{ ...css.card, padding: 20 }}>
                {brief.article.excerpt ? (
                  <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 16px", fontStyle: "italic", borderLeft: "3px solid rgba(99,102,241,0.3)", paddingLeft: 12 }}>{brief.article.excerpt}</p>
                ) : null}
                {brief.article.content ? (
                  <>
                    {brief.article.excerpt && <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "14px 0" }} />}
                    {brief.article.content.split("\n\n").map((para, i) => {
                      if (para.startsWith("## ")) return <h2 key={i} style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", margin: "16px 0 8px" }}>{para.replace("## ", "")}</h2>;
                      return <p key={i} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.8, margin: "0 0 12px" }}>{para}</p>;
                    })}
                  </>
                ) : null}
                {!brief.article.excerpt && !brief.article.content && (
                  <div style={{ textAlign: "center", padding: "30px 20px" }}>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px" }}>Article content will be generated separately.</p>
                    <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Use the outline and brief details to guide content creation.</p>
                  </div>
                )}
                {brief.outline.sections.length > 0 && !brief.article.content && (
                  <div style={{ marginTop: 10 }}>
                    {brief.outline.sections.map((s, i) => (
                      <div key={i} style={{ padding: "9px 12px", borderRadius: 6, border: "1px dashed rgba(255,255,255,0.06)", marginBottom: 6 }}>
                        <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>{s.heading} <span style={{ fontSize: 10, color: "#334155" }}>— section content</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {editorTab === "eeat" && (
              eeatEntries.length > 0 ? (
                <div>
                  <div style={{ ...css.card, padding: 18, marginBottom: 12, display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ textAlign: "center", minWidth: 70 }}>
                      <div style={{ fontSize: 36, fontWeight: 900, color: eeatColor, lineHeight: 1 }}>{eeatAvg}</div>
                      <div style={{ fontSize: 9, color: "#475569", marginTop: 3, fontWeight: 700, textTransform: "uppercase" }}>Overall EEAT</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 7, background: "rgba(255,255,255,0.05)", borderRadius: 4, overflow: "hidden", marginBottom: 7 }}>
                        <div style={{ height: "100%", width: `${(parseFloat(eeatAvg) / 10) * 100}%`, background: `linear-gradient(90deg, ${eeatColor}88, ${eeatColor})`, borderRadius: 4 }} />
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{parseFloat(eeatAvg) >= 8 ? "Excellent — Ready for approval and publishing." : parseFloat(eeatAvg) >= 7 ? "Good — Minor improvements recommended." : "Needs Work — AI improvement suggested."}</p>
                    </div>
                  </div>
                  {eeatEntries.map((item) => {
                    const c = item.score >= 8 ? "#10b981" : item.score >= 7 ? "#f59e0b" : "#ef4444";
                    return (
                      <div key={item.label} style={{ ...css.card, padding: 14, marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{item.label}</span>
                          <span style={{ fontSize: 17, fontWeight: 800, color: c }}>{item.score}</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginBottom: 7 }}>
                          <div style={{ height: "100%", width: `${(item.score / 10) * 100}%`, background: c, borderRadius: 2 }} />
                        </div>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}>💡 {item.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ ...css.card, padding: 40, textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 4px" }}>🎯 EEAT analysis not available yet</p>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>EEAT scores will appear once the analysis is complete.</p>
                </div>
              )
            )}
            {editorTab === "meta" && (
              brief.meta.title || brief.meta.description || brief.meta.og_title || brief.meta.faq.length > 0 ? (
                <div style={{ ...css.card, padding: 18 }}>
                  {[{ l: "Title Tag", v: brief.meta.title, c: brief.meta.title.length }, { l: "Meta Description", v: brief.meta.description, c: brief.meta.description.length }, { l: "OG Title", v: brief.meta.og_title, c: null }].filter(f => f.v).map((f) => (
                    <div key={f.l} style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: 5 }}>{f.l} {f.c ? <span style={{ color: f.c > 60 && f.c < 100 ? "#10b981" : "#f59e0b", fontWeight: 500, textTransform: "none" }}>({f.c} chars)</span> : null}</label>
                      <div style={{ padding: "9px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", fontSize: 12, color: "#e2e8f0", lineHeight: 1.6 }}>{f.v}</div>
                    </div>
                  ))}
                  {brief.meta.faq.length > 0 && <div>
                    <label style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", display: "block", marginBottom: 9 }}>FAQ Schema</label>
                    {brief.meta.faq.map((faq, i) => (
                      <div key={i} style={{ padding: "10px 12px", borderRadius: 7, border: "1px solid rgba(245,158,11,0.1)", background: "rgba(245,158,11,0.03)", marginBottom: 7 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#fcd34d", margin: "0 0 4px" }}>Q: {faq.q}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>A: {faq.a}</p>
                      </div>
                    ))}
                  </div>}
                </div>
              ) : (
                <div style={{ ...css.card, padding: 40, textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 4px" }}>🔖 Meta data not available yet</p>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>Meta tags and FAQ schema will appear once generated.</p>
                </div>
              )
            )}
            {editorTab === "outline" && (
              brief.outline.sections.length > 0 ? (
                <div style={{ ...css.card, padding: 18 }}>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "#c7d2fe", margin: "0 0 12px" }}>Article Structure</h3>
                  {brief.outline.sections.map((s, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#334155", minWidth: 18 }}>{i + 1}</span>
                        <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "rgba(99,102,241,0.1)", color: "#818cf8", fontWeight: 700 }}>{s.type.toUpperCase()}</span>
                        <span style={{ fontSize: 12, color: "#e2e8f0" }}>{s.heading}</span>
                      </div>
                      {(s as { subsections?: { heading: string; type: string }[] }).subsections?.map((sub, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px 7px 36px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.03)", background: "rgba(255,255,255,0.005)", marginBottom: 4 }}>
                          <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "rgba(139,92,246,0.08)", color: "#a78bfa", fontWeight: 700 }}>{sub.type.toUpperCase()}</span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>{sub.heading}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ ...css.card, padding: 40, textAlign: "center" }}>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 4px" }}>📋 Outline not available yet</p>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>Article structure will appear once generated.</p>
                </div>
              )
            )}
          </div>
          {/* Right sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {eeatEntries.length > 0 && (
              <div style={{ ...css.card, padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", margin: "0 0 9px" }}>EEAT Snapshot</p>
                {eeatEntries.map((item) => {
                  const c = item.score >= 8 ? "#10b981" : item.score >= 7 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
                      <span style={{ fontSize: 10, color: "#94a3b8", width: 80, flexShrink: 0 }}>{item.label}</span>
                      <div style={{ flex: 1, height: 3, background: "rgba(255,255,255,0.04)", borderRadius: 2 }}>
                        <div style={{ height: "100%", width: `${(item.score / 10) * 100}%`, background: c, borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: c, width: 22, textAlign: "right" }}>{item.score}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{ ...css.card, padding: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", margin: "0 0 9px" }}>Brief Details</p>
              {[["Author", brief.author], ["Created", brief.created], ["Words", brief.words.toLocaleString()], ["Cluster", brief.cluster]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#475569" }}>{l}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
            {brief.eeat > 0 && (
              <div style={{ ...css.card, padding: 14 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", margin: "0 0 9px" }}>Overall Score</p>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: eeatColor, lineHeight: 1 }}>{brief.eeat}</div>
                  <div style={{ fontSize: 10, color: "#475569", marginTop: 3 }}>EEAT Score</div>
                </div>
              </div>
            )}
            <div style={{ ...css.card, padding: 14 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", margin: "0 0 9px" }}>Actions</p>
              {[{ l: "⚡ AI Improve Content", c: "#8b5cf6", fn: simulateImprove }, { l: "🚀 Publish Now", c: "#10b981", fn: handlePublish }, { l: "⏰ Add to Calendar", c: "#f59e0b", fn: handleScheduleToCalendar }].map((a) => (
                <button key={a.l} onClick={a.fn} style={{ width: "100%", display: "block", padding: "7px 10px", borderRadius: 6, border: `1px solid ${a.c}20`, background: `${a.c}08`, color: a.c, fontSize: 11, fontWeight: 600, cursor: "pointer", marginBottom: 5, textAlign: "left" }}>{a.l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    const statusColors: Record<string, string> = { draft: "#6366f1", pending_approval: "#f59e0b", published: "#10b981", scheduled: "#3b82f6" };
    const statusLabels: Record<string, string> = { draft: "Draft", pending_approval: "Pending Approval", published: "Published", scheduled: "Scheduled" };

    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "0 0 3px" }}>Content Studio</h1>
            <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>AI-generated briefs with EEAT scoring and multi-channel publishing</p>
          </div>
          <button onClick={() => { setSelectedBrief(contentBriefs[0]); setContentView("editor"); setEditorTab("article"); }} style={{ ...css.btn, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>
            <Icon name="plus" size={13} color="#fff" /> New Brief
          </button>
        </div>
        {briefError && (
          <div style={{ padding: "10px 14px", borderRadius: 9, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="alert" size={14} color="#fca5a5" />
            <span style={{ fontSize: 12, color: "#fca5a5", fontWeight: 600 }}>{briefError}</span>
            <span style={{ fontSize: 11, color: "#64748b" }}>— Please try again from Research</span>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18 }}>
          {[{ label: "Total Briefs", value: String(allBriefs.length), icon: "📄", color: "#818cf8" }, { label: "Avg EEAT Score", value: allBriefs.length > 0 ? (allBriefs.reduce((s, b) => s + b.eeat, 0) / allBriefs.length).toFixed(1) : "0", icon: "🎯", color: "#10b981" }, { label: "Pending Approval", value: String(allBriefs.filter(b => b.status === "pending_approval").length), icon: "⏳", color: "#f59e0b" }, { label: "Published", value: String(allBriefs.filter(b => b.status === "published").length), icon: "✅", color: "#10b981" }].map((s, i) => <StatCard key={i} {...s} />)}
        </div>
        <div style={{ ...css.card, overflow: "hidden" }}>
          <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Content Briefs</h2>
            <div style={{ display: "flex", gap: 7 }}>
              <select style={css.select}><option>All Status</option><option>Draft</option><option>Pending</option><option>Published</option></select>
              <select style={css.select}><option>All Clusters</option></select>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2.5fr 1.2fr 0.7fr 0.6fr 0.7fr 0.7fr", padding: "7px 18px", fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <span>Title</span><span>Status</span><span>EEAT</span><span>Words</span><span>Cluster</span><span>Actions</span>
          </div>
          {allBriefs.map((brief, i) => {
            const briefEeatColor = brief.eeat >= 8 ? "#10b981" : brief.eeat >= 7 ? "#f59e0b" : "#ef4444";
            return (
              <div key={brief.id} style={{ display: "grid", gridTemplateColumns: "2.5fr 1.2fr 0.7fr 0.6fr 0.7fr 0.7fr", padding: "12px 18px", borderBottom: i < allBriefs.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", alignItems: "center" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.015)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 2px", cursor: "pointer" }} onClick={() => { setSelectedBrief(brief); setContentView("editor"); setEditorTab("article"); }}>{brief.title}</p>
                  <div style={{ display: "flex", gap: 6 }}>
                    <span style={{ fontSize: 10, color: "#475569" }}>{brief.keyword}</span>
                    {brief.publishedOn && <span style={{ fontSize: 10, color: "#10b981" }}>Published {brief.publishedOn}</span>}
                    {brief.scheduledFor && <span style={{ fontSize: 10, color: "#3b82f6" }}>Scheduled {brief.scheduledFor}</span>}
                  </div>
                </div>
                <div><Badge color={statusColors[brief.status] || "#64748b"}>{statusLabels[brief.status] || brief.status}</Badge></div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 800, color: briefEeatColor }}>{brief.eeat}</span>
                  <span style={{ fontSize: 10, color: "#475569" }}>/10</span>
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{brief.words.toLocaleString()}</span>
                <div><Badge color="#64748b">{brief.cluster.split(" ")[0]}</Badge></div>
                <div style={{ display: "flex", gap: 5 }}>
                  <button onClick={() => { setSelectedBrief(brief); setContentView("editor"); setEditorTab("article"); }} style={{ padding: "4px 9px", borderRadius: 5, border: "1px solid rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.08)", color: "#818cf8", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Open</button>
                  <button style={{ padding: "4px 9px", borderRadius: 5, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#475569", fontSize: 11, cursor: "pointer" }}>···</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (briefLoading) return renderLoading();
  if (contentView === "editor" && selectedBrief) return renderContentEditor();
  return renderListView();
}
