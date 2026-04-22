import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ResultsPanel from '../components/ResultsPanel'
import AIRecommendations from '../components/AIRecommendations'

export default function Results() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('eligible')

  if (!state?.results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Results Found</h2>
        <p className="text-gray-500 mb-6">Please fill the eligibility form first.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          ← Go to Home
        </button>
      </div>
    )
  }

  const { results, profile } = state
  const eligible = results.eligibleSchemes || []
  const nearMisses = results.nearMisses || []
  const aiAnalysis = results.aiAnalysis || {}

  const tabs = [
    { id: 'eligible', label: `✅ Eligible Schemes`, count: eligible.length },
    { id: 'near', label: `📋 Near Misses`, count: nearMisses.length },
    { id: 'ai', label: `🤖 AI Recommendations`, count: null },
  ]

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/')}
            className="text-blue-200 hover:text-white text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back to Profile
          </button>
          <h2 className="text-2xl font-bold">Eligibility Results</h2>
          <p className="text-blue-200 text-sm mt-1">
            Analysis for <span className="font-semibold text-white">{profile?.name || 'User'}</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Summary Card */}
        <ProfileSummary profile={profile} />

        {/* AI Summary */}
        {aiAnalysis.summary && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex gap-3">
            <span className="text-2xl flex-shrink-0">🤖</span>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">AI Analysis Summary</h3>
              <p className="text-blue-800 text-sm leading-relaxed">{aiAnalysis.summary}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-3.5 
                            text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-700 bg-blue-50/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === 'eligible' && (
              <ResultsPanel schemes={eligible} type="eligible" />
            )}
            {activeTab === 'near' && (
              <ResultsPanel schemes={nearMisses} type="near" />
            )}
            {activeTab === 'ai' && (
              <AIRecommendations aiAnalysis={aiAnalysis} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileSummary({ profile }) {
  if (!profile) return null
  const items = [
    { label: 'Age', value: `${profile.age} years` },
    { label: 'Gender', value: capitalize(profile.gender) },
    { label: 'State', value: profile.state },
    { label: 'Category', value: profile.category?.toUpperCase() },
    { label: 'Annual Income', value: `₹${Number(profile.annualIncome).toLocaleString('en-IN')}` },
    { label: 'Occupation', value: formatOccupation(profile.occupation) },
    { label: 'BPL Holder', value: profile.bplCardHolder ? 'Yes' : 'No' },
    { label: 'Family Size', value: `${profile.familySize} members` },
  ]
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span>👤</span> Profile Summary — {profile.name}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-gray-50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
}

function formatOccupation(occ) {
  return occ ? occ.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : ''
}
