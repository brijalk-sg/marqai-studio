import { useState } from 'react'
import api from '../../../lib/api'
import { INDUSTRY_GROUPS } from '../Constants'

export interface Step1Data {
  industry: string
  website: string
  keywords: string[]
}

interface Step1Props {
  onNext: (data: Step1Data) => void
}

export const Step1 = ({ onNext }: Step1Props) => {
  const [niche, setNiche] = useState('')
  const [industry, setIndustry] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [industrySearch, setIndustrySearch] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const hasGenerated = keywords.length > 0

  const filteredGroups = industrySearch.trim()
    ? INDUSTRY_GROUPS.map((group) => ({
        ...group,
        industries: group.industries.filter((item) =>
          item.toLowerCase().includes(industrySearch.toLowerCase())
        ),
      })).filter((group) => group.industries.length > 0)
    : INDUSTRY_GROUPS

  const handleGenerate = async () => {
    if (!niche.trim() || !industry) return
    setIsGenerating(true)
    setError('')
    try {
      const { data } = await api.post('save-project', {
        website: niche.trim(),
        industry,
      });
      setKeywords(data.keywords ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const addKeyword = () => {
    const trimmed = newKeyword.trim()
    if (!trimmed || keywords.includes(trimmed)) return
    setKeywords((prev) => [...prev, trimmed])
    setNewKeyword('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left — Form */}
      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-1">Tell us about your brand</h2>
        <p className="text-surface-400 mb-8">Select your niche and industry to get started.</p>

        {/* Niche input */}
        <div className="mb-6">
          <label htmlFor="niche" className="block text-sm font-medium text-surface-300 mb-2">
            Niche / Topic
          </label>
          <input
            id="niche"
            type="text"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            placeholder="e.g. SaaS productivity tools"
            className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-3 text-white placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          />
        </div>

        {/* Industry dropdown */}
        <div className="mb-8 relative">
          <label htmlFor="industry" className="block text-sm font-medium text-surface-300 mb-2">
            Industry
          </label>
          <button
            id="industry"
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full rounded-lg bg-surface-800 border border-surface-700 px-4 py-3 text-left flex items-center justify-between outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors cursor-pointer"
          >
            <span className={industry ? 'text-white' : 'text-surface-500'}>
              {industry || 'Select an industry'}
            </span>
            <svg
              className={`w-4 h-4 text-surface-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full max-h-72 rounded-lg bg-surface-800 border border-surface-700 shadow-lg flex flex-col">
              <div className="p-2 border-b border-surface-700">
                <input
                  type="text"
                  value={industrySearch}
                  onChange={(e) => setIndustrySearch(e.target.value)}
                  placeholder="Search industries..."
                  autoFocus
                  className="w-full rounded-md bg-surface-700 border border-surface-600 px-3 py-2 text-sm text-white placeholder:text-surface-500 outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <div className="overflow-y-auto flex-1">
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => (
                    <div key={group.category}>
                      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-400 bg-surface-800 sticky top-0">
                        {group.category}
                      </div>
                      {group.industries.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setIndustry(item)
                            setIsDropdownOpen(false)
                            setIndustrySearch('')
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                            industry === item
                              ? 'bg-primary-600/20 text-primary-300'
                              : 'text-surface-200 hover:bg-surface-700'
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-6 text-sm text-surface-500 text-center">
                    No industries found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Generate button */}
        <button
          onClick={handleGenerate}
          disabled={!niche.trim() || !industry || isGenerating}
          className="w-full rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 text-white font-semibold transition-colors cursor-pointer flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              Generating...
            </>
          ) : (
            <>
              Generate Keywords
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-error">{error}</p>
        )}
      </div>

      {/* Right — Keywords */}
      <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8 flex flex-col">
        <h3 className="text-lg font-semibold text-white mb-1">Keywords</h3>
        <p className="text-surface-400 text-sm mb-6">
          {hasGenerated
            ? 'Remove or add keywords, then continue.'
            : 'Fill in your niche & industry and generate keywords.'}
        </p>

        {hasGenerated ? (
          <>
            {/* Add keyword input */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a keyword..."
                className="flex-1 rounded-lg bg-surface-800 border border-surface-700 px-4 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
              />
              <button
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
                className="rounded-lg bg-surface-700 hover:bg-surface-600 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-sm text-white font-medium transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Keywords list */}
            <div className="flex-1 overflow-y-auto max-h-80">
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-600/15 text-primary-300 text-sm border border-primary-500/20"
                  >
                    {kw}
                    <button
                      onClick={() => setKeywords((prev) => prev.filter((k) => k !== kw))}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Continue */}
            <button
              onClick={() => onNext({ industry, website: niche.trim(), keywords })}
              disabled={keywords.length === 0}
              className="mt-6 w-full rounded-lg bg-primary-500 hover:bg-primary-600 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3 text-white font-semibold transition-colors cursor-pointer"
            >
              Continue
            </button>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-surface-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
              <p>Your keywords will appear here</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
