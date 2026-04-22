import { useParams, useNavigate } from 'react-router-dom'

export default function SchemeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center animate-fade-in">
      <div className="text-6xl mb-4">🏛️</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-2">Scheme Detail</h2>
      <p className="text-gray-500 mb-2">Scheme ID: <code className="bg-gray-100 px-2 py-0.5 rounded">{id}</code></p>
      <p className="text-gray-500 mb-6">Detailed scheme pages are served from the main eligibility results.</p>
      <button onClick={() => navigate(-1)} className="btn-primary">
        ← Go Back
      </button>
    </div>
  )
}
