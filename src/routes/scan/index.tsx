import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Scanner } from '@/components/scanner/Scanner'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'
import { Search, Camera, Shirt, ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/scan/')({
  component: Home
})

/**
 * Render the scan home screen with a live scanner, manual SKU/style search forms, and authentication-aware controls.
 *
 * The component maintains Supabase authentication state, updates the UI based on session presence (shows login/logout and a style-number search only when authenticated), and provides handlers to navigate to the product scan route for SKU or style-number searches and to sign out.
 *
 * @returns The JSX element for the scan page containing the live Scanner, manual entry forms, and footer status.
 */
function Home() {
  const [sku, setSku] = useState('')
  const [styleNumber, setStyleNumber] = useState('')
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (sku.trim()) {
      navigate({
        to: '/scan/product/$sku',
        params: { sku: sku.trim() }
      })
    }
  }

  const handleStyleNumberSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (styleNumber.trim()) {
      navigate({
        to: '/scan/product/$sku',
        params: { sku: styleNumber.trim() }
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-marks-gray-bg p-6 md:p-12 flex flex-col items-center">
      {/* App Branding */}
      <header className="mb-12 text-center relative w-full max-w-md">
        <Link to="/" className="absolute left-0 top-2 text-slate-400 hover:text-slate-600">
          <ArrowLeft />
        </Link>
        {session ? (
          <button
            onClick={handleLogout}
            className="absolute right-0 top-2 text-slate-400 hover:text-marks-orange font-bold text-xs uppercase tracking-wider"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" search={{ redirect: '/scan' }} className="absolute right-0 top-2 text-slate-400 hover:text-marks-orange font-bold text-xs uppercase tracking-wider">
            Login
          </Link>
        )}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-marks-navy rounded-2xl mb-4 shadow-lg shadow-blue-900/20">
          <Shirt className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
          Square <span className="text-marks-orange underline decoration-slate-200 underline-offset-8">Scan</span>
        </h1>
        <p className="text-slate-500 font-medium">Inventory & Price Check</p>
      </header>

      <div className="w-full max-w-md space-y-8">
        {/* Scanner Module */}
        <section className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center">
              <Camera className="w-4 h-4 mr-2 text-marks-orange" />
              Live Scanner
            </h2>
            <span className="flex h-2 w-2 rounded-full bg-marks-orange animate-pulse"></span>
          </div>
          <Scanner />
        </section>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-4 bg-marks-gray-bg text-slate-400 font-black uppercase tracking-widest">Manual Entry</span>
          </div>
        </div>

        {/* Manual Search Form */}
        <form
          onSubmit={handleSearch}
          className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 transition-all focus-within:ring-2 focus-within:ring-marks-orange/20"
        >
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center px-1">
              <Search className="w-3.5 h-3.5 mr-2" />
              SKU or Barcode Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. 12345678"
                className="flex-grow min-h-[54px] px-5 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-marks-orange transition-all font-mono text-lg font-bold text-slate-700 placeholder:text-slate-300"
              />
              <button
                type="submit"
                disabled={!sku.trim()}
                className="bg-marks-navy text-white px-6 rounded-2xl font-black hover:bg-marks-navy-light transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-slate-200"
              >
                GO
              </button>
            </div>
          </div>
        </form>

        {/* Style Number Search - Only when logged in */}
        {session && (
          <form
            onSubmit={handleStyleNumberSearch}
            className="bg-marks-navy p-6 rounded-[2rem] shadow-xl shadow-blue-900/20 border border-marks-navy transition-all focus-within:ring-2 focus-within:ring-marks-orange/20"
          >
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em] flex items-center px-1">
                <Search className="w-3.5 h-3.5 mr-2" />
                Style Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={styleNumber}
                  onChange={(e) => setStyleNumber(e.target.value)}
                  placeholder="e.g. 77561"
                  className="flex-grow min-h-[54px] px-5 rounded-2xl border-0 bg-white/10 text-white placeholder:text-white/30 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all font-mono text-lg font-bold placeholder:text-slate-300"
                />
                <button
                  type="submit"
                  disabled={!styleNumber.trim()}
                  className="bg-marks-orange text-white px-6 rounded-2xl font-black hover:bg-marks-orange-light transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg"
                >
                  GO
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Bottom Status */}
        <footer className="pt-8 text-center">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            System V1.0.5 • Warehouse Connected
          </p>
        </footer>
      </div>
    </div>
  )
}