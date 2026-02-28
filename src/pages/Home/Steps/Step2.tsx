interface Step2Props {
  onNext: () => void
  onBack: () => void
}

export const Step2 = ({ onNext, onBack }: Step2Props) => {
  return (
    <div className="bg-surface-900 border border-surface-700 rounded-2xl p-8 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Step 2</h2>
      <p className="text-surface-400 mb-8">Coming soon</p>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-lg border border-surface-700 px-6 py-3 text-surface-300 hover:bg-surface-800 font-semibold transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 rounded-lg bg-primary-500 hover:bg-primary-600 px-6 py-3 text-white font-semibold transition-colors cursor-pointer"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
