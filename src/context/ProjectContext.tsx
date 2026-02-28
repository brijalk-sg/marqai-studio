import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export interface ProjectData {
  industry: string
  website: string
  keywords: string[]
  projectId: string | null
}

interface ProjectContextType {
  project: ProjectData | null
  setProject: (data: ProjectData) => void
  clearProject: () => void
}

const STORAGE_KEY = 'marqai_project'

const ProjectContext = createContext<ProjectContextType | null>(null)

function loadFromStorage(): ProjectData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [project, setProjectState] = useState<ProjectData | null>(loadFromStorage)

  const setProject = useCallback((data: ProjectData) => {
    setProjectState(data)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  const clearProject = useCallback(() => {
    setProjectState(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <ProjectContext.Provider value={{ project, setProject, clearProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProject must be used within ProjectProvider')
  return ctx
}
