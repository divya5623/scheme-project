import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  return (
    <header>
      {/* Tricolor stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-saffron-500" />
        <div className="flex-1 bg-white" />
        <div className="flex-1" style={{ backgroundColor: '#138808' }} />
      </div>

      {/* Main header */}
      <div className="header-gradient text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & title */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="text-4xl leading-none group-hover:scale-110 transition-transform duration-200">
                🏛️
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">SchemeAssist</h1>
                <p className="text-xs text-blue-200 font-medium">
                  AI-powered Government Scheme Eligibility System
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              <NavLink to="/" active={location.pathname === '/'}>
                Home
              </NavLink>
              <NavLink to="/about" active={location.pathname === '/about'}>
                About
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        active
          ? 'bg-white/20 text-white shadow-sm'
          : 'text-blue-100 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </Link>
  )
}
