import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Icon } from '../ui'
import { useRole } from '../../context/RoleContext'
import { NAV_ITEMS } from './navigation'
import { notifs } from '../../data/mockData'

interface TopBarProps {
  onMenuClick: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { pathname } = useLocation()
  const { roleInfo, userName } = useRole()
  const [showNotif, setShowNotif] = useState(false)

  const pageLabel = NAV_ITEMS.find((n) => pathname.startsWith(n.path))?.label || 'Dashboard'

  return (
    <header
      style={{
        height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(10,14,26,0.9)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        gap: 10,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        style={{
          padding: 7,
          borderRadius: 7,
          border: 'none',
          background: 'transparent',
          color: '#94a3b8',
          cursor: 'pointer',
          display: 'none',
        }}
        className="mobile-menu-btn"
      >
        <Icon name="grid" size={16} />
      </button>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
        <span style={{ color: '#475569' }}>MarqAI</span>
        <span style={{ color: '#334155' }}>/</span>
        <span style={{ color: '#94a3b8', fontWeight: 600 }}>{pageLabel}</span>
      </div>

      <div style={{ flex: 1 }} />

      {/* Search */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 7,
          padding: '5px 10px',
          width: 200,
        }}
      >
        <Icon name="search" size={13} color="#475569" />
        <input
          placeholder="Search..."
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: 12,
            width: '100%',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* AI Online */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '4px 9px',
          borderRadius: 6,
          background: 'rgba(16,185,129,0.06)',
          border: '1px solid rgba(16,185,129,0.12)',
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 6px #10b981',
          }}
        />
        <span style={{ fontSize: 11, color: '#6ee7b7', fontWeight: 600 }}>AI Online</span>
      </div>

      {/* Notifications */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setShowNotif(!showNotif)}
          style={{
            padding: 7,
            borderRadius: 7,
            border: 'none',
            background: showNotif ? 'rgba(255,255,255,0.06)' : 'transparent',
            color: '#94a3b8',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <Icon name="bell" size={16} />
          <span
            style={{
              position: 'absolute',
              top: 3,
              right: 3,
              width: 13,
              height: 13,
              borderRadius: '50%',
              background: '#ef4444',
              fontSize: 8,
              fontWeight: 700,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            4
          </span>
        </button>
        {showNotif && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: 320,
              marginTop: 5,
              background: '#151b2e',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 10,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              zIndex: 50,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '11px 14px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f1f5f9' }}>Notifications</span>
              <span style={{ fontSize: 11, color: '#6366f1', cursor: 'pointer' }}>Mark all read</span>
            </div>
            {notifs.map((n) => (
              <div
                key={n.id}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid rgba(255,255,255,0.03)',
                  display: 'flex',
                  gap: 7,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    marginTop: 4,
                    flexShrink: 0,
                    background:
                      n.type === 'success'
                        ? '#10b981'
                        : n.type === 'warning'
                          ? '#f59e0b'
                          : n.type === 'alert'
                            ? '#ef4444'
                            : '#6366f1',
                  }}
                />
                <div>
                  <p style={{ fontSize: 11, color: '#cbd5e1', margin: '0 0 2px', lineHeight: 1.4 }}>
                    {n.text}
                  </p>
                  <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: `${roleInfo.color}20`,
            border: `1.5px solid ${roleInfo.color}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
          }}
        >
          {roleInfo.icon}
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>{userName}</p>
          <p style={{ fontSize: 10, color: roleInfo.color, margin: 0 }}>{roleInfo.short}</p>
        </div>
      </div>

      {/* Click-away for notifications */}
      {showNotif && (
        <div
          onClick={() => setShowNotif(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 20 }}
        />
      )}
    </header>
  )
}
