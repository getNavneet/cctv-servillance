import React from 'react';
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛡️</span>
          <span className="text-lg font-bold text-gray-900">SmartSuraksha</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">
            How it works
          </a>
          <a href="#benefits" className="text-gray-600 hover:text-gray-900">
            Benefits
          </a>
          <a href="#faq" className="text-gray-600 hover:text-gray-900">
            FAQ
          </a>
          <button  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700">
            Register Camera
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-5 py-8 md:py-12">
        <div className="grid md:grid-cols-[2fr_1.4fr] gap-8 items-start">
          {/* Left Column */}
          <section>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Register your CCTV. Keep your area safer.
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              A voluntary city camera registry that helps police know where cameras exist
              in your gali or market. Sharing of video is{' '}
              <strong className="text-gray-900">optional</strong> and always under your control.
            </p>
            <div className="flex flex-wrap gap-3 mb-3">
              <button onClick={() => navigate("/register")} className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 shadow-sm">
                Register your camera
              </button>
              <button  className="bg-white text-gray-900 px-6 py-3 rounded-full font-medium border border-gray-300 hover:bg-gray-50">
                View how it works
              </button>
            </div>
            <p className="text-sm text-gray-500">
              No live access. No automatic sharing. Police only see that a camera exists at your location.
            </p>
          </section>

          {/* Right Card */}
          <section>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Why register?</h2>
              <ul className="space-y-2 text-gray-700 mb-4">
                <li className="flex gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Police can quickly find cameras after a crime or accident.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>You decide if you want to share footage when requested.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-blue-600 mt-1">✓</span>
                  <span>Helps protect your shop, society and neighbourhood.</span>
                </li>
              </ul>
              <div className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                For Indian cities • Citizen first
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-5 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">How it works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm mb-3">
              1
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Register basic details</h3>
            <p className="text-gray-600 text-sm">
              Share only your address, camera type and coverage direction. No need to give live stream URL or footage access.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm mb-3">
              2
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Police see camera on map</h3>
            <p className="text-gray-600 text-sm">
              During any incident, authorised officers see that a camera exists in that lane and can contact you if needed.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm mb-3">
              3
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">You stay in full control</h3>
            <p className="text-gray-600 text-sm">
              You can decide case by case whether to share recordings or not. Sharing is always voluntary.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits for you</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Safer neighbourhood</h3>
              <p className="text-gray-600 text-sm">
                Faster investigations and better chances of identifying suspects after thefts, fights or accidents in your area.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Proof when you need it</h3>
              <p className="text-gray-600 text-sm">
                If something happens to your shop or building, police already know where to look for possible evidence.
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Zero cost to join</h3>
              <p className="text-gray-600 text-sm">
                Registration is free and takes under 1 minute using your phone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-5 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Common questions</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Will police see my live camera feed?
            </h3>
            <p className="text-gray-600 text-sm">
              No. By default, registration only tells police that a camera exists at your address.
              Live or recording access is separate and always requires your consent.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is registration compulsory?
            </h3>
            <p className="text-gray-600 text-sm">
              No, this is a voluntary community program designed to improve safety.
              You can register or remove your camera any time.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Is my data secure?
            </h3>
            <p className="text-gray-600 text-sm">
              All data is stored securely and only authorised officials can see the registry.
              Every access is logged for transparency.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} SmartSuraksha • Smart Surveillance for Safer Cities
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
