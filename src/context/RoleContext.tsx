import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type RoleId = 'admin' | 'seo_exec' | 'writer'

export interface RoleInfo {
  label: string
  short: string
  icon: string
  color: string
}

export const ROLES: Record<RoleId, RoleInfo> = {
  admin: { label: 'Admin / CEO', short: 'Admin', icon: '\u{1F454}', color: '#f59e0b' },
  seo_exec: { label: 'SEO Executive', short: 'SEO Exec', icon: '\u{1F4CA}', color: '#10b981' },
  writer: { label: 'Content Writer', short: 'Writer', icon: '\u270D\uFE0F', color: '#6366f1' },
}

export const ROLE_NAMES: Record<RoleId, string> = {
  admin: 'Sarah Chen',
  seo_exec: 'Alex Rivera',
  writer: 'Jordan Kim',
}

interface RoleContextType {
  role: RoleId
  setRole: (role: RoleId) => void
  roleInfo: RoleInfo
  userName: string
}

const STORAGE_KEY = 'marqai_role'

const RoleContext = createContext<RoleContextType | null>(null)

function loadRole(): RoleId {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in ROLES) return stored as RoleId
  return 'seo_exec'
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleId>(loadRole)

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r)
    localStorage.setItem(STORAGE_KEY, r)
  }, [])

  return (
    <RoleContext.Provider
      value={{ role, setRole, roleInfo: ROLES[role], userName: ROLE_NAMES[role] }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const ctx = useContext(RoleContext)
  if (!ctx) throw new Error('useRole must be used within RoleProvider')
  return ctx
}
