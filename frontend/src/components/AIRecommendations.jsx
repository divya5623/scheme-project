const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  low: 'bg-green-100 text-green-700 border border-green-200',
}

export default function AIRecommendations({ aiAnalysis }) {
  if (!aiAnalysis || Object.keys(aiAnalysis).length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-5xl mb-3">🤖</div>
        <p className="font-medium">AI recommendations not available.</p>
      </div>
    )
  }

  const {
    summary,
    topRecommendations = [],
    alternatives = [],
    generalAdvice,
    nextSteps = [],
  } = aiAnalysis

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Summary */}
      {summary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
          <div className="flex gap-3">
            <span className="text-3xl flex-shrink-0">🤖</span>
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">AI Analysis</h4>
              <p className="text-blue-800 text-sm leading-relaxed">{summary}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Recommendations */}
      {topRecommendations.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>⭐</span> Top Recommendations
          </h4>
          <div className="space-y-3">
            {topRecommendations.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>🔄</span> Alternative Schemes to Explore
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {alternatives.map((alt, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="font-medium text-gray-800 text-sm">{alt.schemeName || alt.name || alt}</p>
                {alt.reason && <p className="text-xs text-gray-500 mt-1">{alt.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Advice */}
      {generalAdvice && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            <span>💡</span> General Advice
          </h4>
          <p className="text-amber-800 text-sm leading-relaxed">{generalAdvice}</p>
        </div>
      )}

      {/* Next Steps */}
      {nextSteps.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
            <span>🎯</span> Recommended Next Steps
          </h4>
          <ol className="space-y-2">
            {nextSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-green-800">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-600 text-white 
                                 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

function RecommendationCard({ rec, index }) {
  const priority = rec.priority?.toLowerCase() || 'medium'
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.medium

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h5 className="font-semibold text-gray-800 text-sm flex-1">
          {index + 1}. {rec.schemeName || rec.name || 'Scheme'}
        </h5>
        {priority && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${priorityStyle}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </span>
        )}
      </div>
      {rec.explanation && (
        <p className="text-gray-600 text-sm mb-2 leading-relaxed">{rec.explanation}</p>
      )}
      {rec.applicationTip && (
        <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-2.5 mt-2">
          <span className="text-blue-500 text-sm flex-shrink-0">💡</span>
          <p className="text-blue-700 text-xs leading-relaxed">{rec.applicationTip}</p>
        </div>
      )}
    </div>
  )
}
