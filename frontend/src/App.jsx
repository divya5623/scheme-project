import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Results from './pages/Results'
import SchemeDetail from './pages/SchemeDetail'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/scheme/:id" element={<SchemeDetail />} />
        </Routes>
      </main>
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm mt-auto">
        <p>© 2024 SchemeAssist — AI-powered Government Scheme Eligibility System</p>
        <p className="text-xs mt-1 text-gray-500">For informational purposes only. Verify eligibility on official government portals.</p>
      </footer>
    </div>
  )
}
