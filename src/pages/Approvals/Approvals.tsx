import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Badge, StatCard } from '../../components/ui'
import { css } from '../../lib/styles'

interface PendingItem {
  id: string
  title: string
  author: string
  submittedOn: string
  eeat: number
  words: number
  keyword: string
  cluster: string
  predictedUplift: string
  excerpt: string
  eeatScore: { experience: number; expertise: number; authority: number; trust: number }
  urgency: string
  reason: string
}

const pendingItems: PendingItem[] = [
  {
    id: 'cb-002',
    title: 'PCI DSS 4.0 and AI: What Your Fraud Team Needs to Know',
    author: 'Jordan Kim',
    submittedOn: 'Feb 27, 2026',
    eeat: 8.3,
    words: 2140,
    keyword: 'PCI DSS 4.0 AI fraud detection',
    cluster: 'Compliance & Regulatory',
    predictedUplift: "+3 positions for 'PCI DSS 4.0 compliance'",
    excerpt:
      'PCI DSS 4.0 enforcement began March 31, 2025. Most compliance guides treat it as a checkbox exercise — this one shows exactly how AI fraud detection maps to the new requirements.',
    eeatScore: { experience: 8.1, expertise: 8.5, authority: 8.2, trust: 8.4 },
    urgency: 'high',
    reason: 'Rising query trend — publish before end of week for maximum impact',
  },
]

export const Approvals = () => {
  const navigate = useNavigate()
  const [approvalFilter, setApprovalFilter] = useState('all')
  const [approvedItems, setApprovedItems] = useState<string[]>([])
  const [rejectedItems, setRejectedItems] = useState<string[]>([])
  const [expandedApproval, setExpandedApproval] = useState<string | null>(null)
  const [approvalNote, setApprovalNote] = useState('')

  const visibleItems = pendingItems.filter(
    (i) => !approvedItems.includes(i.id) && !rejectedItems.includes(i.id)
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 3px' }}>
            Approval Dashboard
          </h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            Review AI-generated content before publishing — Admin workflow
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'urgent', 'reviewed'].map((f) => (
            <button
              key={f}
              onClick={() => setApprovalFilter(f)}
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                border: `1px solid ${approvalFilter === f ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                background: approvalFilter === f ? 'rgba(99,102,241,0.1)' : 'transparent',
                color: approvalFilter === f ? '#c7d2fe' : '#64748b',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 18 }}>
        <StatCard label="Pending Review" value={String(visibleItems.length)} color="#f59e0b" icon="⏳" />
        <StatCard label="Approved Today" value={String(approvedItems.length)} color="#10b981" icon="✅" />
        <StatCard label="Rejected / Revise" value={String(rejectedItems.length)} color="#ef4444" icon="↩️" />
        <StatCard label="Avg EEAT in Queue" value="8.3" color="#818cf8" icon="🎯" />
      </div>

      {/* Approved banner */}
      {approvedItems.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 9,
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.15)',
            marginBottom: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>✅</span>
          <span style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 600 }}>
            Content approved and sent to Publishing Hub!
          </span>
          <button
            onClick={() => navigate('/publishing')}
            style={{
              marginLeft: 'auto',
              padding: '4px 10px',
              borderRadius: 5,
              border: 'none',
              background: 'rgba(16,185,129,0.15)',
              color: '#10b981',
              fontSize: 10,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Go to Publishing →
          </button>
        </div>
      )}

      {/* Rejected banner */}
      {rejectedItems.length > 0 && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 9,
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 12, color: '#fca5a5', fontWeight: 600 }}>
            ↩️ Content sent back to writer with revision notes.
          </span>
        </div>
      )}

      {/* All caught up */}
      {visibleItems.length === 0 && (
        <div style={{ ...css.card, padding: 36, textAlign: 'center' }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🎉</div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 5px' }}>
            All caught up!
          </h3>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            No content pending approval right now.
          </p>
        </div>
      )}

      {/* Pending items */}
      {visibleItems.map((item) => (
        <div key={item.id} style={{ ...css.card, padding: 18, marginBottom: 12 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12,
            }}
          >
            <div style={{ flex: 1, marginRight: 14 }}>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 5 }}>
                {item.urgency === 'high' && <Badge color="#ef4444">🔴 Urgent</Badge>}
                <Badge color="#64748b">{item.cluster}</Badge>
                <span style={{ fontSize: 10, color: '#475569' }}>
                  by {item.author} · {item.submittedOn}
                </span>
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 5px' }}>
                {item.title}
              </h2>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>
                🔑 {item.keyword} · {item.words.toLocaleString()} words ·{' '}
                <span style={{ color: '#10b981', fontWeight: 600 }}>{item.predictedUplift}</span>
              </p>
            </div>
            <div style={{ textAlign: 'center', minWidth: 55 }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#10b981', lineHeight: 1 }}>
                {item.eeat}
              </div>
              <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
                EEAT
              </div>
            </div>
          </div>

          {/* Urgency reason */}
          <div
            style={{
              padding: '9px 12px',
              borderRadius: 7,
              background: 'rgba(239,68,68,0.04)',
              border: '1px solid rgba(239,68,68,0.1)',
              marginBottom: 12,
              display: 'flex',
              gap: 7,
            }}
          >
            <Icon name="zap" size={13} color="#fca5a5" />
            <span style={{ fontSize: 11, color: '#fca5a5' }}>{item.reason}</span>
          </div>

          {/* Excerpt */}
          <p
            style={{
              fontSize: 12,
              color: '#94a3b8',
              lineHeight: 1.7,
              margin: '0 0 12px',
              borderLeft: '3px solid rgba(99,102,241,0.2)',
              paddingLeft: 10,
            }}
          >
            {item.excerpt}
          </p>

          {/* EEAT breakdown */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 7,
              marginBottom: 12,
            }}
          >
            {Object.entries(item.eeatScore).map(([k, v]) => {
              let scoreColor = '#ef4444'
              if (v >= 8) scoreColor = '#10b981'
              else if (v >= 7) scoreColor = '#f59e0b'
              return (
                <div
                  key={k}
                  style={{
                    padding: '9px 10px',
                    borderRadius: 7,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 16, fontWeight: 800, color: scoreColor }}>{v}</div>
                  <div style={{ fontSize: 9, color: '#475569', marginTop: 1, textTransform: 'capitalize' }}>
                    {k}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Revision notes toggle */}
          <button
            onClick={() => setExpandedApproval(expandedApproval === item.id ? null : item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '5px 10px',
              borderRadius: 5,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'transparent',
              color: '#64748b',
              fontSize: 11,
              cursor: 'pointer',
              marginBottom: 12,
            }}
          >
            <Icon name={expandedApproval === item.id ? 'chevDown' : 'chevRight'} size={11} />
            {expandedApproval === item.id ? 'Hide' : 'Add'} revision notes
          </button>
          {expandedApproval === item.id && (
            <textarea
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              placeholder="Add a note for the writer (optional for approval, required for rejection)..."
              style={{
                ...css.input,
                height: 70,
                resize: 'vertical',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                marginBottom: 12,
              }}
            />
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setApprovedItems([...approvedItems, item.id])}
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: 7,
                border: 'none',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
              }}
            >
              <Icon name="check" size={13} color="#fff" /> Approve & Send to Publishing
            </button>
            <button
              onClick={() => navigate('/content-studio')}
              style={{
                padding: '10px 14px',
                borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.02)',
                color: '#94a3b8',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              👁 Preview
            </button>
            <button
              onClick={() => setRejectedItems([...rejectedItems, item.id])}
              style={{
                padding: '10px 14px',
                borderRadius: 7,
                border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.06)',
                color: '#fca5a5',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ↩ Revise
            </button>
            <button
              style={{
                padding: '10px 14px',
                borderRadius: 7,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'transparent',
                color: '#475569',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              ⏰ Schedule
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
