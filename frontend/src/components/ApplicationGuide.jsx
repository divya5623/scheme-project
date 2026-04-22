export default function ApplicationGuide({ scheme }) {
  const docs = scheme.requiredDocuments || scheme.documents || []
  const steps = scheme.applicationProcess || scheme.steps || []
  const tips = scheme.keyTips || scheme.tips || []
  const website = scheme.officialWebsite || scheme.website || ''

  return (
    <div className="mt-3 border border-blue-100 rounded-xl overflow-hidden animate-slide-up">
      <div className="bg-blue-50 px-4 py-2.5 border-b border-blue-100">
        <h5 className="font-semibold text-blue-900 text-sm">📌 Application Guide</h5>
      </div>

      <div className="p-4 space-y-4 bg-white">
        {/* Required Documents */}
        {docs.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              📄 Required Documents
            </p>
            <ul className="space-y-1.5">
              {docs.map((doc, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-400 flex-shrink-0 mt-0.5">◆</span>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Steps */}
        {steps.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              🔢 Application Steps
            </p>
            <ol className="space-y-2">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-700 
                                   text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Key Tips */}
        {tips.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              💡 Key Tips
            </p>
            <ul className="space-y-1.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500 flex-shrink-0">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Official Website */}
        {website && (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-white bg-blue-700 
                       hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors duration-200 
                       font-medium mt-1"
          >
            🌐 Apply on Official Website →
          </a>
        )}

        {!docs.length && !steps.length && !tips.length && !website && (
          <p className="text-sm text-gray-500 text-center py-4">
            Application guide details not available. Please visit the official government portal.
          </p>
        )}
      </div>
    </div>
  )
}
