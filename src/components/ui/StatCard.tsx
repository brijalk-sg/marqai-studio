import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  change?: string | number
  color?: string
  icon?: ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, change, color, icon }) => (
  <div
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '14px',
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.02em' }}>
        {label}
      </span>
      {icon && <span style={{ fontSize: '18px', opacity: 0.7 }}>{icon}</span>}
    </div>
    <span style={{ fontSize: '28px', fontWeight: 800, color: color || '#f1f5f9', letterSpacing: '-0.02em' }}>
      {value}
    </span>
    {change && (
      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{change}</span>
    )}
  </div>
)
