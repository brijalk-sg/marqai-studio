import { useEffect, useState } from 'react'
import api from '../../../lib/api'
import type { Step1Data } from './Step1'

const PROJECT_ID = '69a2cc5f8b20c2fbe4da5ce9'

interface Step2Props {
  onNext: () => void
  onBack: () => void
  step1Data: Step1Data | null
}

export const Step2 = ({ onNext, onBack, step1Data }: Step2Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [subheadings, setSubheadings] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOutline = async () => {
      setIsLoading(true)
      setError('')
      try {
        const { data } = await api.post('generate-blog-outline', {
          projectId: PROJECT_ID,
          industry: step1Data?.industry ?? '',
          website: step1Data?.website ?? '',
          keywords: step1Data?.keywords ?? [],
        })
        setTitle(data.title ?? '')
        setSubheadings(data.headings ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        setIsLoading(false)
      }
    }
    fetchOutline()
  }, [step1Data])

  const updateSubheading = (index: number, value: string) => {
    setSubheadings((prev) => prev.map((s, i) => (i === index ? value : s)))
  }

  const removeSubheading = (index: number) => {
    setSubheadings((prev) => prev.filter((_, i) => i !== index))
  }

  const addSubheading = () => {
    setSubheadings((prev) => [...prev, ''])
  }

  if (isLoading) {
    return (
      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <svg className="w-8 h-8 text-primary-500 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-surface-400 text-sm">Generating content outline...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-400 text-sm mb-4">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="rounded-lg border border-surface-700 px-6 py-3 text-surface-300 hover:bg-surface-800 font-semibold transition-colors cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={() => {
              setError('')
              setIsLoading(true)
              api.post('generate-blog-outline', {
                projectId: PROJECT_ID,
                industry: step1Data?.industry ?? '',
                website: step1Data?.website ?? '',
                keywords: step1Data?.keywords ?? [],
              })
                .then(({ data }) => {
                  setTitle(data.title ?? '')
                  setSubheadings(data.headings ?? [])
                })
                .catch((err) => {
                  setError(err instanceof Error ? err.message : 'Something went wrong')
                })
                .finally(() => setIsLoading(false))
            }}
            className="rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-white font-semibold transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8">
      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Content Outline</h2>
          <p className="text-surface-400 text-sm">
            Review the generated outline and approve or edit it.
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 rounded-lg border border-surface-700 px-3 py-1.5 text-sm text-surface-300 hover:bg-surface-800 hover:text-white transition-colors cursor-pointer"
        >
          {isEditing ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Done
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
              Edit
            </>
          )}
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-xs font-medium uppercase tracking-wider text-surface-500 mb-2">
          Title
        </label>
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-3 text-white text-lg font-semibold outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        ) : (
          <h3 className="text-lg font-semibold text-white px-4 py-3">
            {title}
          </h3>
        )}
      </div>

      {/* Subheadings */}
      <div className="mb-8">
        <label className="block text-xs font-medium uppercase tracking-wider text-surface-500 mb-2">
          Subheadings
        </label>
        <div className="space-y-2">
          {subheadings.map((sub, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-6 text-center text-xs font-medium text-surface-500">
                {i + 1}.
              </span>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => updateSubheading(i, e.target.value)}
                    className="flex-1 rounded-lg bg-surface-800 border border-surface-700 px-4 py-2.5 text-sm text-white outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                  />
                  <button
                    onClick={() => removeSubheading(i)}
                    className="rounded-md p-1.5 text-surface-500 hover:text-red-400 hover:bg-surface-800 transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                <p className="flex-1 px-4 py-2.5 text-sm text-surface-200">
                  {sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {isEditing && (
          <button
            onClick={addSubheading}
            className="mt-3 ml-8 flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add subheading
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-surface-700 px-6 py-3 text-surface-300 hover:bg-surface-800 font-semibold transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!title.trim() || subheadings.length === 0}
          className="flex-1 rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 text-white font-semibold transition-colors cursor-pointer"
        >
          Approve & Continue
        </button>
      </div>
    </div>
  )
}
