import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Icon } from '../ui'
import { NAV_ITEMS } from './navigation'
import { useRole, ROLES, type RoleId } from '../../context/RoleContext'

interface SidebarProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const location = useLocation()
  const { role, setRole, roleInfo } = useRole()
  const [showRoleMenu, setShowRoleMenu] = useState(false)

  const filteredNav = NAV_ITEMS.filter((n) => n.roles.includes(role))

  const content = (mobile: boolean) => {
    const sideW = mobile ? 220 : collapsed ? 64 : 220
    return (
      <aside
        style={{
          width: sideW,
          background: '#0d1120',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.2s',
          flexShrink: 0,
          height: '100%',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: collapsed && !mobile ? '14px 8px' : '14px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 52,
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 800,
              color: '#fff',
              flexShrink: 0,
            }}
          >
            M
          </div>
          {(!collapsed || mobile) && (
            <span style={{ fontSize: 14, fontWeight: 800, color: '#c7d2fe' }}>
              MarqAI <span style={{ fontWeight: 400, color: '#475569' }}>Studio</span>
            </span>
          )}
          {mobile && (
            <button
              onClick={() => setMobileOpen(false)}
              style={{
                marginLeft: 'auto',
                padding: 5,
                borderRadius: 5,
                border: 'none',
                background: 'transparent',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              <Icon name="x" size={14} />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px 5px', overflowY: 'auto' }}>
          {filteredNav.map((item) => {
            const active = location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => mobile && setMobileOpen(false)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: collapsed && !mobile ? '9px' : '8px 10px',
                  borderRadius: 7,
                  border: 'none',
                  cursor: 'pointer',
                  marginBottom: 2,
                  justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
                  position: 'relative',
                  background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: active ? '#c7d2fe' : '#64748b',
                  transition: 'all 0.15s',
                  textDecoration: 'none',
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 18,
                      borderRadius: '0 2px 2px 0',
                      background: '#6366f1',
                    }}
                  />
                )}
                <Icon name={item.iconName} size={16} />
                {(!collapsed || mobile) && (
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: active ? 600 : 500,
                      flex: 1,
                      textAlign: 'left',
                    }}
                  >
                    {item.label}
                  </span>
                )}
                {(!collapsed || mobile) && item.badge && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      minWidth: 17,
                      height: 17,
                      borderRadius: 9,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(239,68,68,0.15)',
                      color: '#fca5a5',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>

        {/* Collapse toggle */}
        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              margin: '0 5px 5px',
              padding: 7,
              borderRadius: 7,
              border: '1px solid rgba(255,255,255,0.05)',
              background: 'transparent',
              color: '#475569',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
              fontSize: 11,
            }}
          >
            <Icon name={collapsed ? 'chevRight' : 'chevLeft'} size={13} />
            {!collapsed && <span>Collapse</span>}
          </button>
        )}

        {/* Role Switcher */}
        <div
          style={{
            padding: '8px 5px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
          }}
        >
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: collapsed && !mobile ? 7 : '7px 10px',
              borderRadius: 7,
              border: `1px solid ${roleInfo.color}30`,
              background: `${roleInfo.color}08`,
              color: roleInfo.color,
              cursor: 'pointer',
              justifyContent: collapsed && !mobile ? 'center' : 'flex-start',
            }}
          >
            <span style={{ fontSize: 14 }}>{roleInfo.icon}</span>
            {(!collapsed || mobile) && (
              <>
                <span
                  style={{ fontSize: 11, fontWeight: 600, flex: 1, textAlign: 'left' }}
                >
                  {roleInfo.short}
                </span>
                <Icon name="chevDown" size={11} />
              </>
            )}
          </button>
          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                left: 5,
                right: 5,
                background: '#151b2e',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                padding: 4,
                marginBottom: 5,
                boxShadow: '0 -8px 30px rgba(0,0,0,0.5)',
                zIndex: 50,
              }}
            >
              {(Object.entries(ROLES) as [RoleId, typeof roleInfo][]).map(([k, r]) => (
                <button
                  key={k}
                  onClick={() => {
                    setRole(k)
                    setShowRoleMenu(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                    padding: '7px 9px',
                    borderRadius: 6,
                    border: 'none',
                    background: role === k ? `${r.color}12` : 'transparent',
                    color: role === k ? r.color : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                  {role === k && <span style={{ marginLeft: 'auto' }}>✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>
    )
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div style={{ display: 'flex', height: '100vh', position: 'sticky', top: 0, flexShrink: 0 }}>
        {content(false)}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
              zIndex: 40,
            }}
          />
          <div style={{ position: 'fixed', inset: '0 auto 0 0', zIndex: 50 }}>
            {content(true)}
          </div>
        </>
      )}

      {/* Click-away for role menu */}
      {showRoleMenu && (
        <div
          onClick={() => setShowRoleMenu(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 30 }}
        />
      )}
    </>
  )
}
