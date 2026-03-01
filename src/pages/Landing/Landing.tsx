import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/* ── Intersection Observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible] as const;
}

/* ── Animated counter ── */
function Counter({ end, suffix = "", duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useInView(0.3);
  useEffect(() => {
    if (!vis) return;
    let t = 0;
    const steps = duration / 16;
    const inc = end / steps;
    const id = setInterval(() => {
      t += inc;
      if (t >= end) { setVal(end); clearInterval(id); }
      else setVal(Number(t.toFixed(1)));
    }, 16);
    return () => clearInterval(id);
  }, [vis, end, duration]);
  return <span ref={ref}>{end % 1 !== 0 ? val.toFixed(1) : Math.floor(val)}{suffix}</span>;
}

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0, y = 50, className = "", style = {} }: { children: React.ReactNode; delay?: number; y?: number; className?: string; style?: React.CSSProperties }) {
  const [ref, vis] = useInView(0.08);
  return (
    <div ref={ref} className={className} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateY(0)" : `translateY(${y}px)`,
      transition: `opacity 0.75s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.75s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>{children}</div>
  );
}

/* ── EEAT Ring Gauge ── */
function Ring({ score, color, letter, label, delay = 0 }: { score: number; color: string; letter: string; label: string; delay?: number }) {
  const [ref, vis] = useInView(0.2);
  const r = 40, c = 2 * Math.PI * r;
  const pct = score / 10;
  return (
    <div ref={ref} style={{
      textAlign: "center", opacity: vis ? 1 : 0, transform: vis ? "none" : "scale(0.85) translateY(20px)",
      transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
    }}>
      <div style={{ position: "relative", width: 110, height: 110, margin: "0 auto 10px" }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r={r} fill="none" stroke="#1E293B" strokeWidth="7" />
          <circle cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={`${vis ? pct * c : 0} ${c}`} strokeLinecap="round"
            transform="rotate(-90 55 55)"
            style={{ transition: `stroke-dasharray 1.4s cubic-bezier(.16,1,.3,1) ${delay + 0.3}s` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: "#fff", fontFamily: "var(--heading)" }}>{score}</span>
          <span style={{ fontSize: 10, color: "#64748B" }}>/10</span>
        </div>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: "50%", background: color + "22",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 6px", fontSize: 18, fontWeight: 900, color, fontFamily: "var(--heading)",
      }}>{letter}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>{label}</div>
    </div>
  );
}

/* ════════════════ MAIN ════════════════ */
export function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    const onMove = (e: MouseEvent) => { setMx(e.clientX); setMy(e.clientY); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMove); };
  }, []);

  // smooth-scroll
  const goTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div style={{ background: "#060913", color: "#fff", minHeight: "100vh", overflowX: "hidden", fontFamily: "var(--body)" }}>

      {/* ── Global styles + keyframes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Anybody:wght@400;600;700;800;900&display=swap');
        :root { --heading: 'Anybody', sans-serif; --body: 'Outfit', sans-serif; }
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: #6366F1; color: #fff; }

        @keyframes orbit1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(40px,-30px)} 66%{transform:translate(-20px,20px)} }
        @keyframes orbit2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,-40px)} }
        @keyframes orbit3 { 0%,100%{transform:translate(0,0)} 40%{transform:translate(20px,30px)} 70%{transform:translate(-15px,-10px)} }
        @keyframes pulse { 0%,100%{opacity:.35} 50%{opacity:1} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes spin { 0%{transform:rotate(0)} 100%{transform:rotate(360deg)} }
        @keyframes dash { 0%{stroke-dashoffset:1000} 100%{stroke-dashoffset:0} }

        .landing-glow { height:1px; background:linear-gradient(90deg,transparent,#6366F1,#8B5CF6,#10B981,transparent); opacity:.35; }
        .landing-grid-bg {
          background-image:
            linear-gradient(rgba(99,102,241,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.025) 1px, transparent 1px);
          background-size: 64px 64px;
        }
        .landing-card { background:rgba(15,18,32,0.7); border:1px solid rgba(99,102,241,0.08); border-radius:16px; backdrop-filter:blur(12px); transition:all 0.35s ease; }
        .landing-card:hover { border-color:rgba(99,102,241,0.28); transform:translateY(-5px); box-shadow:0 16px 40px rgba(0,0,0,0.25); }
        .landing-nav-link { color:#94A3B8; font-size:14px; font-weight:500; text-decoration:none; transition:color 0.2s; cursor:pointer; }
        .landing-nav-link:hover { color:#fff; }

        @media (max-width:900px) {
          .landing-hide-mobile { display:none !important; }
          .landing-hero-grid { grid-template-columns:1fr !important; text-align:center !important; }
          .landing-pipeline-grid { grid-template-columns:repeat(2,1fr) !important; }
          .landing-cols-4 { grid-template-columns:repeat(2,1fr) !important; }
          .landing-cols-3 { grid-template-columns:1fr !important; }
          .landing-cols-2 { grid-template-columns:1fr !important; }
          .landing-eeat-row { flex-wrap:wrap !important; }
        }
        @media (max-width:600px) {
          .landing-pipeline-grid { grid-template-columns:1fr !important; }
          .landing-cols-4 { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── Cursor glow ── */}
      <div style={{
        position: "fixed", width: 450, height: 450, borderRadius: "50%", pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(circle, rgba(99,102,241,0.045) 0%, transparent 70%)",
        left: mx - 225, top: my - 225, transition: "left 0.25s ease-out, top 0.25s ease-out",
      }} />

      {/* ══════════════════ NAV ══════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(6,9,19,0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.12)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68, padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
           <img src="/icon.svg" alt="Marqai studio" height={44} width={48}/>
            <span style={{ fontFamily: "var(--heading)", fontSize: 17, fontWeight: 800 }}>
              <span style={{ color: "#fff" }}>MARQ</span><span style={{ color: "#818CF8" }}>AI</span>
            </span>
          </div>

          <div className="landing-hide-mobile" style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {[["features","Features"],["pipeline","Pipeline"],["eeat","EEAT Engine"],["stack","Tech Stack"],["market","Market"]].map(([id,t]) => (
              <span key={id} className="landing-nav-link" style={{ fontFamily: "var(--body)" }} onClick={() => goTo(id)}>{t}</span>
            ))}
            <button
            onClick={() => navigate('/dashboard')}
              style={{
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", border: "none",
              padding: "9px 22px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--body)", boxShadow: "0 0 24px rgba(99,102,241,0.25)",
              transition: "all 0.25s ease",
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 0 36px rgba(99,102,241,0.5)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "0 0 24px rgba(99,102,241,0.25)"}>
                
              Get Early Access
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════ HERO ══════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "110px 24px 80px" }}>
        {/* Floating orbs */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 600, height: 600, top: "-8%", left: "-8%", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.13),transparent 70%)", filter: "blur(60px)", animation: "orbit1 22s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 500, height: 500, bottom: "5%", right: "-5%", borderRadius: "50%", background: "radial-gradient(circle,rgba(139,92,246,0.1),transparent 70%)", filter: "blur(50px)", animation: "orbit2 28s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: 350, height: 350, bottom: "20%", left: "25%", borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.08),transparent 70%)", filter: "blur(40px)", animation: "orbit3 25s ease-in-out infinite" }} />
        </div>
        <div className="landing-grid-bg" style={{ position: "absolute", inset: 0 }} />

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 820 }}>
          {/* Badge */}
          <Reveal delay={0}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: 100, padding: "7px 18px", marginBottom: 28 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981", animation: "pulse 2s ease-in-out infinite" }} />
              <span style={{ fontSize: 12, color: "#C7D2FE", fontWeight: 600, letterSpacing: 1.5, fontFamily: "var(--body)" }}>BUILT IN 18 HOURS · HACKATHON 2026</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 style={{ fontSize: "clamp(38px,6.5vw,72px)", fontWeight: 900, lineHeight: 1.05, fontFamily: "var(--heading)", marginBottom: 20, letterSpacing: "-0.02em" }}>
              AI-Powered SEO<br />
              <span style={{ background: "linear-gradient(135deg,#818CF8,#A78BFA,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Content Marketing</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p style={{ fontSize: "clamp(16px,1.8vw,19px)", color: "#94A3B8", maxWidth: 580, margin: "0 auto 36px", lineHeight: 1.7 }}>
              From keyword research to multi-channel publishing — one unified platform that automates your entire content pipeline with Claude AI.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
              <button style={{
                background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", border: "none",
                padding: "15px 34px", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "var(--body)", boxShadow: "0 0 36px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 0 56px rgba(99,102,241,0.55), inset 0 1px 0 rgba(255,255,255,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 36px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.08)"; }}>
                Get Early Access
              </button>
              <button style={{
                background: "rgba(255,255,255,0.04)", color: "#C7D2FE", border: "1px solid rgba(99,102,241,0.25)",
                padding: "15px 34px", borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: "pointer",
                fontFamily: "var(--body)", backdropFilter: "blur(8px)", transition: "all 0.3s ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.1)"; e.currentTarget.style.borderColor = "#6366F1"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.25)"; }}>
                Watch Demo
              </button>
            </div>
          </Reveal>

          {/* Hero stats */}
          <Reveal delay={0.32}>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
              {[["7","Screens Built"],["85%","Time Saved"],["8.3","Avg EEAT"]].map(([v,l],i) => (
                <div key={i}>
                  <div style={{ fontSize: 30, fontWeight: 900, fontFamily: "var(--heading)", background: "linear-gradient(135deg,#818CF8,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{v}</div>
                  <div style={{ fontSize: 13, color: "#64748B", fontWeight: 500 }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", animation: "float 2.5s ease-in-out infinite" }}>
          <div style={{ width: 22, height: 36, borderRadius: 11, border: "2px solid rgba(99,102,241,0.25)", display: "flex", justifyContent: "center", paddingTop: 7 }}>
            <div style={{ width: 3, height: 7, borderRadius: 2, background: "#818CF8" }} />
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ PROBLEM ══════════════════ */}
      <section style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#EF4444", letterSpacing: 3, fontFamily: "var(--heading)" }}>THE PROBLEM</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>
                Content Marketing is <span style={{ color: "#EF4444" }}>Broken</span>
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }} className="landing-cols-2">
            {[
              ["6+ Disconnected Tools","SEMrush for research, Jasper for writing, WordPress for publishing, Trello for scheduling...","#F59E0B"],
              ["40+ Hours Per Article","From keyword research to final publish takes weeks with manual handoffs between teams.","#EF4444"],
              ["Content Decay is Silent","Pages lose rankings without warning. Teams only notice after traffic has already collapsed.","#3B82F6"],
              ["No Quality Scoring","No way to measure content against Google's EEAT framework before hitting publish.","#8B5CF6"],
              ["Approval Bottlenecks","Content sits in review queues for days. No structured workflow or audit trail.","#06B6D4"],
              ["ROI is Invisible","Can't connect content efforts to business outcomes. Marketing reports take hours.","#10B981"],
            ].map(([title,desc,color],i) => (
              <Reveal key={i} delay={i*0.06}>
                <div className="landing-card" style={{ padding: 22, display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: color+"12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--heading)", marginBottom: 4, color: "#F1F5F9" }}>{title}</h3>
                    <p style={{ fontSize: 13.5, color: "#94A3B8", lineHeight: 1.6 }}>{desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <p style={{ textAlign: "center", marginTop: 28, fontSize: 13.5, color: "#64748B" }}>
              <span style={{ color: "#EF4444", fontWeight: 700 }}>Result:</span> 73% of marketing teams say content operations are their biggest bottleneck. <em>(Content Marketing Institute, 2025)</em>
            </p>
          </Reveal>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ PIPELINE ══════════════════ */}
      <section id="pipeline" style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", letterSpacing: 3, fontFamily: "var(--heading)" }}>HOW IT WORKS</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>5-Step Automated Pipeline</h2>
              <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 12 }}>
                One platform replaces <span style={{ color: "#10B981", fontWeight: 700 }}>6+ tools</span> — reduces content cycle from <span style={{ color: "#F59E0B", fontWeight: 700 }}>40 hours to 4</span>
              </p>
            </div>
          </Reveal>

          <div className="landing-pipeline-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
            {[
              ["1","Research","AI topic discovery, keyword clustering, SERP gap analysis","#10B981"],
              ["2","Write","AI-generated drafts with EEAT scoring & meta tags","#8B5CF6"],
              ["3","Review","Structured approvals, feedback loops, audit trail","#F59E0B"],
              ["4","Schedule","AI-optimized editorial calendar & rank prediction","#3B82F6"],
              ["5","Publish","Multi-channel deployment, AI optimisation, live analytics","#06B6D4"],
            ].map(([num,title,desc,color],i) => (
              <Reveal key={i} delay={i*0.09}>
                <div className="landing-card" style={{ padding: "26px 18px", textAlign: "center", borderTop: `3px solid ${color}`, position: "relative" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "var(--heading)" }}>{num}</div>
                  <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2, color: "#fff", marginBottom: 8, fontFamily: "var(--heading)", textTransform: "uppercase" }}>{title}</div>
                  <p style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.55 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ 7 SCREENS ══════════════════ */}
      <section id="features" style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#818CF8", letterSpacing: 3, fontFamily: "var(--heading)" }}>FEATURES</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>7 Integrated Screens</h2>
              <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 12, maxWidth: 520, margin: "12px auto 0" }}>Every screen is real, interactive, and production-quality — built from scratch in 18 hours.</p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {[
              ["Dashboard","Role-based KPIs, AI priorities, keyword decay alerts, content velocity tracking","#3B82F6"],
              ["Research","AI topic discovery, keyword clustering, competitor gap analysis, SERP intelligence","#6366F1"],
              ["Content Studio","AI article generation with EEAT scoring, meta tags, and structured outlines","#8B5CF6"],
              ["Visual Assets","Automated image prompt generation for DALL-E & Midjourney with brand consistency","#F59E0B"],
              ["Calendar","AI-optimized editorial calendar with publish timing recommendations","#10B981"],
              ["Publishing","Multi-channel automated deployment to WordPress, LinkedIn, and more","#06B6D4"],
              ["Approvals","Role-based review workflow with EEAT quality gates before publishing","#10B981"],
            ].map(([name,desc,color],i) => (
              <Reveal key={i} delay={i*0.06}>
                <div className="landing-card" style={{ padding: 26, borderTop: `3px solid ${color}` }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: "var(--heading)", marginBottom: 6, color: "#F1F5F9" }}>{name}</h3>
                  <p style={{ fontSize: 13.5, color: "#94A3B8", lineHeight: 1.6 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ EEAT ENGINE ══════════════════ */}
      <section id="eeat" style={{ padding: "96px 24px", position: "relative" }}>
        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#A78BFA", letterSpacing: 3, fontFamily: "var(--heading)" }}>KEY INNOVATION</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>EEAT AI Engine</h2>
              <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 12 }}>Every piece of content is scored against Google's quality framework <em>before</em> it publishes.</p>
            </div>
          </Reveal>

          <div className="landing-eeat-row" style={{ display: "flex", justifyContent: "center", gap: 40, marginBottom: 44 }}>
            <Ring letter="E" label="Experience" score={7.5} color="#3B82F6" delay={0} />
            <Ring letter="E" label="Expertise" score={8.2} color="#818CF8" delay={0.12} />
            <Ring letter="A" label="Authority" score={7.0} color="#A78BFA" delay={0.24} />
            <Ring letter="T" label="Trust" score={8.5} color="#10B981" delay={0.36} />
          </div>

          <Reveal delay={0.25}>
            <div className="landing-card landing-cols-2" style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 24, padding: 28, maxWidth: 580, margin: "0 auto" }}>
              <div style={{ textAlign: "center", padding: "12px 0", background: "rgba(15,18,32,0.7)", borderRadius: 12, border: "1px solid rgba(99,102,241,0.08)" }}>
                <div style={{ fontSize: 46, fontWeight: 900, fontFamily: "var(--heading)", background: "linear-gradient(135deg,#818CF8,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>7.8</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 8 }}>Overall Score</div>
                <span style={{ background: "rgba(16,185,129,0.12)", color: "#10B981", padding: "4px 14px", borderRadius: 100, fontSize: 12, fontWeight: 700 }}>Grade B+</span>
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--heading)", marginBottom: 14 }}>How It Works</h4>
                {["AI analyzes content structure","Scores each EEAT dimension","Suggests specific improvements","One-click fixes applied to draft"].map((t,i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#818CF820", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#818CF8", fontWeight: 800, flexShrink: 0 }}>{i+1}</div>
                    <span style={{ fontSize: 13.5, color: "#E2E8F0" }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ TECH STACK ══════════════════ */}
      <section id="stack" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#22D3EE", letterSpacing: 3, fontFamily: "var(--heading)" }}>ARCHITECTURE</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>Built for Production</h2>
            </div>
          </Reveal>

          <div className="landing-cols-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {[
              { layer: "FRONTEND", tech: "React 18 + Vite", items: ["7 integrated screens","Tailwind CSS dark UI","shadcn/ui components","Recharts visualizations"], color: "#818CF8", icon: "⚛️" },
              { layer: "AI ENGINE", tech: "Claude AI", items: ["EEAT 4-dim scoring","Topic & keyword discovery","Content generation","Image prompt creation"], color: "#10B981", icon: "🧠" },
              { layer: "BACKEND", tech: "n8n + MongoDB", items: ["Webhook automation","Document storage","Multi-channel APIs","Cron scheduling"], color: "#A78BFA", icon: "⚙️" },
            ].map((t,i) => (
              <Reveal key={i} delay={i*0.1}>
                <div className="landing-card" style={{ padding: 28, borderTop: `3px solid ${t.color}` }}>
                  <div style={{ fontSize: 30, marginBottom: 6 }}>{t.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: t.color, letterSpacing: 2, fontFamily: "var(--heading)" }}>{t.layer}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--heading)", marginBottom: 16 }}>{t.tech}</div>
                  <div style={{ borderTop: "1px solid rgba(99,102,241,0.1)", paddingTop: 14 }}>
                    {t.items.map((item,j) => (
                      <div key={j} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 9 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 14, color: "#E2E8F0" }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ METRICS ══════════════════ */}
      <section style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#F59E0B", letterSpacing: 3, fontFamily: "var(--heading)" }}>IMPACT</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>The Numbers Speak</h2>
            </div>
          </Reveal>
          <div className="landing-cols-4" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18 }}>
            {[
              [85,"%","Time Saved","vs manual workflow","#10B981"],
              [8.3,"","EEAT Score","average quality","#818CF8"],
              [4,"x","Content Volume","output per team","#A78BFA"],
              [12,"","API Endpoints","fully automated","#22D3EE"],
            ].map(([end,suf,label,sub,color],i) => (
              <Reveal key={i} delay={i*0.1}>
                <div className="landing-card" style={{ padding: "30px 18px", textAlign: "center" }}>
                  <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "var(--heading)", color: color as string, marginBottom: 4 }}>
                    <Counter end={end as number} suffix={suf as string} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--heading)", marginBottom: 4 }}>{label as string}</div>
                  <div style={{ fontSize: 13, color: "#64748B" }}>{sub as string}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ MARKET ══════════════════ */}
      <section id="market" style={{ padding: "96px 24px" }}>
        <div style={{ maxWidth: 950, margin: "0 auto" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#3B82F6", letterSpacing: 3, fontFamily: "var(--heading)" }}>MARKET OPPORTUNITY</span>
              <h2 style={{ fontSize: "clamp(30px,4.5vw,46px)", fontWeight: 900, fontFamily: "var(--heading)", marginTop: 10 }}>
                <span style={{ background: "linear-gradient(135deg,#818CF8,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>$412B</span> Industry
              </h2>
              <p style={{ fontSize: 16, color: "#94A3B8", marginTop: 10 }}>Growing <span style={{ color: "#10B981", fontWeight: 700 }}>14.3% CAGR</span> through 2030</p>
            </div>
          </Reveal>

          <div className="landing-cols-2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14 }}>
            {[
              ["SaaS & Tech","$84B","Content-heavy growth engines spending $50K-500K/yr","#818CF8"],
              ["Digital Agencies","$62B","Managing content for 10-50 clients at scale","#A78BFA"],
              ["E-Commerce","$56B","SEO-driven acquisition competing for product keywords","#22D3EE"],
              ["Enterprise","$120B","50+ person teams needing workflow & governance","#10B981"],
            ].map(([name,tam,desc,color],i) => (
              <Reveal key={i} delay={i*0.08}>
                <div className="landing-card" style={{ padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `4px solid ${color}` }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "var(--heading)" }}>{name}</div>
                    <div style={{ fontSize: 13, color: "#94A3B8", marginTop: 3 }}>{desc}</div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 900, color, fontFamily: "var(--heading)", whiteSpace: "nowrap", marginLeft: 14 }}>{tam}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="landing-glow" />

      {/* ══════════════════ CTA ══════════════════ */}
      <section style={{ padding: "110px 24px", position: "relative", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{ position: "absolute", width: 500, height: 500, top: "10%", left: "50%", transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.1),transparent 70%)", filter: "blur(80px)" }} />
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto" }}>
          <Reveal>
            <h2 style={{ fontSize: "clamp(30px,5vw,50px)", fontWeight: 900, fontFamily: "var(--heading)", lineHeight: 1.1, marginBottom: 18 }}>
              The Future of Content Marketing is{" "}
              <span style={{ background: "linear-gradient(135deg,#818CF8,#A78BFA,#22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Intelligent, Unified, and Automated.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontSize: 16, color: "#94A3B8", marginBottom: 36, lineHeight: 1.7 }}>
              MarqAI Studio proves it can be built. In 18 hours, we created a production-quality platform that turns keyword intelligence into published, optimised content.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <button style={{
              background: "linear-gradient(135deg,#6366F1,#7C3AED)", color: "#fff", border: "none",
              padding: "18px 48px", borderRadius: 14, fontSize: 18, fontWeight: 800, cursor: "pointer",
              fontFamily: "var(--heading)", letterSpacing: 0.5,
              boxShadow: "0 0 48px rgba(99,102,241,0.35), 0 0 96px rgba(99,102,241,0.1)",
              transition: "all 0.3s ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px) scale(1.02)"; e.currentTarget.style.boxShadow = "0 0 64px rgba(99,102,241,0.55), 0 0 120px rgba(99,102,241,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 0 48px rgba(99,102,241,0.35), 0 0 96px rgba(99,102,241,0.1)"; }}>
              See the Live Demo&nbsp;↗
            </button>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer style={{ borderTop: "1px solid rgba(99,102,241,0.1)", padding: "36px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg,#6366F1,#7C3AED)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontWeight: 900, color: "#fff", fontSize: 13, fontFamily: "var(--heading)" }}>M</span>
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "var(--heading)" }}>
              <span style={{ color: "#fff" }}>MARQ</span><span style={{ color: "#818CF8" }}>AI</span>
              <span style={{ color: "#475569", fontWeight: 400 }}> Studio</span>
            </span>
          </div>
          <span style={{ fontSize: 13, color: "#475569" }}>Built with ❤ in 18 hours · Hackathon February 2026</span>
        </div>
      </footer>
    </div>
  );
}
