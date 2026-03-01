import { useState } from 'react'
import { Icon, Badge } from '../../components/ui'
import { css } from '../../lib/styles'
import { contentBriefs, imagePromptsData } from '../../data/mockData'

export const VisualAssets = () => {
  const [selectedBriefForVisual, setSelectedBriefForVisual] = useState(0)
  const [generatingVisual, setGeneratingVisual] = useState(false)

  const currentPrompts = imagePromptsData[selectedBriefForVisual]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9', margin: '0 0 3px' }}>Visual Assets</h1>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            AI-generated image prompts for DALL-E / Midjourney — optimized for each article
          </p>
        </div>
        <button
          onClick={() => {
            setGeneratingVisual(true)
            setTimeout(() => setGeneratingVisual(false), 3000)
          }}
          disabled={generatingVisual}
          style={{
            ...css.btn,
            border: 'none',
            background: generatingVisual
              ? 'rgba(99,102,241,0.3)'
              : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff',
          }}
        >
          {generatingVisual ? '⏳ Generating...' : '✨ Generate Prompts'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 14 }}>
        {/* Brief selector sidebar */}
        <div style={{ ...css.card, padding: 10 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: '#475569',
              textTransform: 'uppercase',
              margin: '0 0 8px',
              padding: '0 2px',
            }}
          >
            Select Brief
          </p>
          {contentBriefs.slice(0, 2).map((b, i) => (
            <button
              key={b.id}
              onClick={() => setSelectedBriefForVisual(i)}
              style={{
                width: '100%',
                padding: '8px 9px',
                borderRadius: 7,
                border: `1px solid ${selectedBriefForVisual === i ? 'rgba(99,102,241,0.25)' : 'transparent'}`,
                background: selectedBriefForVisual === i ? 'rgba(99,102,241,0.1)' : 'transparent',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: 3,
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: selectedBriefForVisual === i ? '#c7d2fe' : '#94a3b8',
                  margin: '0 0 1px',
                  lineHeight: 1.3,
                }}
              >
                {b.title.split(':')[0]}
              </p>
              <span style={{ fontSize: 10, color: '#475569' }}>{b.eeat}/10 EEAT</span>
            </button>
          ))}
          {contentBriefs.slice(2).map((b) => (
            <div key={b.id} style={{ padding: '8px 9px', opacity: 0.35 }}>
              <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.3 }}>
                {b.title.split(':')[0]}
              </p>
              <span style={{ fontSize: 10, color: '#334155' }}>No prompts yet</span>
            </div>
          ))}
        </div>

        {/* Main content area */}
        <div>
          {generatingVisual && (
            <div style={{ ...css.card, padding: 16, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 9 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#8b5cf6' }} />
                <span style={{ fontSize: 12, color: '#c4b5fd', fontWeight: 600 }}>
                  Claude AI generating image prompts...
                </span>
              </div>
              <div style={{ height: 3, background: 'rgba(255,255,255,0.04)', borderRadius: 2 }}>
                <div
                  style={{
                    height: '100%',
                    width: '60%',
                    background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    borderRadius: 2,
                  }}
                />
              </div>
            </div>
          )}

          {/* Image prompts list */}
          <div style={{ ...css.card, overflow: 'hidden', marginBottom: 12 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h2 style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>
                📸 {currentPrompts?.images.length || 0} Image Prompts —{' '}
                {contentBriefs[selectedBriefForVisual]?.title.split(':')[0]}
              </h2>
            </div>
            {currentPrompts?.images.map((img, i) => (
              <div
                key={`img-${selectedBriefForVisual}-${i}`}
                style={{
                  padding: '14px 16px',
                  borderBottom:
                    i < currentPrompts.images.length - 1
                      ? '1px solid rgba(255,255,255,0.04)'
                      : 'none',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 9,
                  }}
                >
                  <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                    <Badge color="#8b5cf6">{img.type}</Badge>
                    <span style={{ fontSize: 10, color: '#475569' }}>{img.format}</span>
                  </div>
                  <button
                    style={{
                      padding: '3px 9px',
                      borderRadius: 5,
                      border: '1px solid rgba(99,102,241,0.2)',
                      background: 'rgba(99,102,241,0.06)',
                      color: '#818cf8',
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div
                  style={{
                    padding: '10px 12px',
                    borderRadius: 7,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: 7,
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: '#94a3b8',
                      margin: 0,
                      lineHeight: 1.7,
                      fontFamily: 'monospace',
                    }}
                  >
                    {img.prompt}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Icon name="target" size={11} color="#475569" />
                  <span style={{ fontSize: 10, color: '#475569' }}>{img.placement}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tips card */}
          <div
            style={{
              ...css.card,
              padding: 14,
              background: 'rgba(16,185,129,0.03)',
              border: '1px solid rgba(16,185,129,0.1)',
            }}
          >
            <p style={{ fontSize: 12, fontWeight: 700, color: '#6ee7b7', margin: '0 0 7px' }}>
              💡 How to Use These Prompts
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 9 }}>
              {[
                {
                  tool: 'DALL-E 3',
                  tip: "Paste into ChatGPT → DALL-E. Add 'photorealistic' for best results.",
                  color: '#10b981',
                },
                {
                  tool: 'Midjourney',
                  tip: 'Add --ar 16:9 --q 2 --style raw at the end for featured images.',
                  color: '#3b82f6',
                },
                {
                  tool: 'Canva AI',
                  tip: 'Use as style guidance + adjust brand colors afterward.',
                  color: '#f59e0b',
                },
              ].map((g) => (
                <div
                  key={g.tool}
                  style={{
                    padding: '9px 10px',
                    borderRadius: 7,
                    border: `1px solid ${g.color}18`,
                    background: `${g.color}06`,
                  }}
                >
                  <p style={{ fontSize: 11, fontWeight: 700, color: g.color, margin: '0 0 3px' }}>
                    {g.tool}
                  </p>
                  <p style={{ fontSize: 10, color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                    {g.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
