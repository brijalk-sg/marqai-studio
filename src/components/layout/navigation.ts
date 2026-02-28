import type { RoleId } from '../../context/RoleContext'

export interface NavItem {
  id: string
  path: string
  label: string
  iconName: string
  roles: RoleId[]
  badge?: number
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', iconName: 'grid', roles: ['admin', 'seo_exec', 'writer'] },
  { id: 'research', path: '/research', label: 'Research', iconName: 'search', roles: ['seo_exec'] },
  { id: 'content', path: '/content-studio', label: 'Content Studio', iconName: 'edit', roles: ['writer', 'seo_exec'] },
  { id: 'visuals', path: '/visuals', label: 'Visual Assets', iconName: 'image', roles: ['writer'] },
  { id: 'calendar', path: '/calendar', label: 'Calendar', iconName: 'calendar', roles: ['seo_exec', 'admin'] },
  { id: 'publishing', path: '/publishing', label: 'Publishing', iconName: 'send', roles: ['seo_exec', 'admin'] },
  { id: 'approvals', path: '/approvals', label: 'Approvals', iconName: 'check', roles: ['admin'], badge: 4 },
]
