interface ViewSwitcherProps {
  currentView: string
  onViewChange: (view: string) => void
}

const VIEWS = [
  { key: 'timeGridDay', label: 'Day' },
  { key: 'timeGridWeek', label: 'Week' },
  { key: 'dayGridMonth', label: 'Month' },
  { key: 'multiMonthYear', label: 'Year' },
]

export const ViewSwitcher = ({ currentView, onViewChange }: ViewSwitcherProps) => {
  return (
    <div className="flex bg-surface-800 rounded-lg p-1 gap-1">
      {VIEWS.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
            currentView === view.key
              ? 'bg-primary-500 text-white'
              : 'text-surface-400 hover:text-white hover:bg-surface-700'
          }`}
        >
          {view.label}
        </button>
      ))}
    </div>
  )
}
