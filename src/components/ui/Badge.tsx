import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  bg?: string
}

export const Badge: React.FC<BadgeProps> = ({ children, color = '#6366f1', bg }) => (
  <span
    style={{
      fontSize: '10px',
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: '5px',
      background: bg || `${color}18`,
      color,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      whiteSpace: 'nowrap',
      lineHeight: 1,
    }}
  >
    {children}
  </span>
)
