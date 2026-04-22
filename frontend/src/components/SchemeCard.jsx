import { useState } from 'react'
import ApplicationGuide from './ApplicationGuide'

export default function SchemeCard({ schemeData, type }) {
  const [showGuide, setShowGuide] = useState(false)
  const isEligible = type === 'eligible'

  // schemeData is { scheme: {...}, eligibilityResult: {...} }
  const scheme = schemeData?.scheme || schemeData || {}
  const eligibilityResult = schemeData?.eligibilityResult || {}

  const score = eligibilityResult?.score ?? 0
  const scorePercent = Math.round(score)
  const reasons = eligibilityResult?.reasons || []
  const missingCriteria = eligibilityResult?.missingCriteria || []
  const benefits = scheme.benefits || []
  const ministry = scheme.ministry || ''

  const scoreColor =
    scorePercent >= 80 ? 'bg-green-500' :
    scorePercent >= 60 ? 'bg-yellow-500' :
    scorePercent >= 40 ? 'bg-orange-500' : 'bg-red-400'

  return (
    <div className="scheme-card animate-slide-up">
      {/* Card Header */}
      <div className={`px-5 py-4 ${isEligible ? 'bg-green-600' : 'bg-amber-500'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base leading-tight line-clamp-2">
              {scheme.name || 'Unknown Scheme'}
            </h4>
            {ministry && (
              <span className="inline-block mt-1.5 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {ministry}
              </span>
            )}
          </div>
          <div className={`flex-shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
            isEligible ? 'bg-white text-green-700' : 'bg-white text-amber-700'
          }`}>
            {isEligible ? '✓ Eligible' : '⚠ Near Miss'}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Score */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600 font-medium">Eligibility Score</span>
            <span className={`font-bold ${
              scorePercent >= 80 ? 'text-green-600' :
              scorePercent >= 60 ? 'text-yellow-600' : 'text-orange-600'
            }`}>{scorePercent}%</span>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${scoreColor}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
        </div>

        {/* Benefits */}
        {benefits.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Benefits</p>
            <ul className="space-y-1">
              {benefits.slice(0, 3).map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  <span>{b}</span>
                </li>
              ))}
              {benefits.length > 3 && (
                <li className="text-xs text-gray-400 pl-5">+{benefits.length - 3} more benefits</li>
              )}
            </ul>
          </div>
        )}

        {/* Reasons */}
        {reasons.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {isEligible ? 'Why You Qualify' : 'Matching Criteria'}
            </p>
            <ul className="space-y-1">
              {reasons.slice(0, 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Missing Criteria */}
        {!isEligible && missingCriteria.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-yellow-800 uppercase tracking-wide mb-2">
              ⚠ Missing Requirements
            </p>
            <ul className="space-y-1">
              {missingCriteria.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-yellow-800">
                  <span className="mt-0.5 flex-shrink-0">→</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application Guide toggle */}
        {isEligible && (
          <div className="pt-1">
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="w-full text-sm text-blue-700 hover:text-blue-900 font-medium flex items-center 
                         justify-center gap-2 py-2 px-4 rounded-lg border border-blue-200 hover:bg-blue-50 
                         transition-all duration-200"
            >
              {showGuide ? '▲ Hide Application Guide' : '▼ View Application Guide →'}
            </button>
            {showGuide && <ApplicationGuide scheme={scheme} />}
          </div>
        )}
      </div>
    </div>
  )
}
