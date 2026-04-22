import SchemeCard from './SchemeCard'

export default function ResultsPanel({ schemes, type }) {
  const isEligible = type === 'eligible'

  if (!schemes || schemes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-5xl mb-3">{isEligible ? '🔍' : '📋'}</div>
        <p className="font-medium">
          {isEligible ? 'No eligible schemes found.' : 'No near-miss schemes found.'}
        </p>
        <p className="text-sm mt-1">Try adjusting your profile details.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`rounded-lg px-4 py-3 flex items-center gap-2 ${
        isEligible
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
      }`}>
        <span className="text-xl">{isEligible ? '🎉' : '📋'}</span>
        <p className="font-medium text-sm">
          {isEligible
            ? `You are eligible for ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''}!`
            : `Almost Eligible — ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''} with minor requirements missing`}
        </p>
      </div>

      {/* Cards */}
      {schemes.map((schemeData, idx) => (
        <SchemeCard key={schemeData?.scheme?.id || idx} schemeData={schemeData} type={type} />
      ))}
    </div>
  )
}
