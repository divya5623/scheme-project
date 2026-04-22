import ProfileForm from '../components/ProfileForm'

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="header-gradient text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-6">🇮🇳</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Find Your Eligible
            <br />
            <span className="text-saffron-500">Government Schemes</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Fill in your profile once and our AI instantly matches you with all the central &amp;
            state government welfare schemes you qualify for — pensions, subsidies, scholarships,
            loans, and more.
          </p>

          {/* Stats banner */}
          <div className="inline-flex flex-wrap justify-center gap-6 bg-white/10 backdrop-blur-sm 
                          rounded-full px-8 py-3 border border-white/20 text-sm font-semibold">
            <span className="flex items-center gap-2">
              <span className="text-saffron-500 text-lg">📋</span> 50+ Schemes
            </span>
            <span className="text-white/40 hidden sm:block">•</span>
            <span className="flex items-center gap-2">
              <span className="text-saffron-500 text-lg">⚡</span> Instant Analysis
            </span>
            <span className="text-white/40 hidden sm:block">•</span>
            <span className="flex items-center gap-2">
              <span className="text-saffron-500 text-lg">🤖</span> AI-Powered
            </span>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Enter Your Profile</h3>
            <p className="text-gray-500 mt-1">
              All information is processed locally and never stored.
            </p>
          </div>
          <ProfileForm />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 px-4 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-10">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: '📝',
                title: 'Fill Your Profile',
                desc: 'Enter your personal, financial, and occupational details in the form above.',
              },
              {
                step: '2',
                icon: '🤖',
                title: 'AI Analysis',
                desc: 'Our AI engine checks your profile against 50+ government schemes instantly.',
              },
              {
                step: '3',
                icon: '🎯',
                title: 'Get Results',
                desc: 'View all eligible schemes with benefit details, documents needed, and how to apply.',
              },
            ].map((item) => (
              <div key={item.step} className="text-center group">
                <div className="relative inline-flex">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center 
                                  text-3xl mb-4 group-hover:bg-blue-100 transition-colors duration-200 
                                  mx-auto shadow-sm border border-blue-100">
                    {item.icon}
                  </div>
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-700 
                                   text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h4 className="font-semibold text-gray-800 text-lg mb-2">{item.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
