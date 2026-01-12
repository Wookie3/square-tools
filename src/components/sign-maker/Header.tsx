import { Link } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

import { useState, useEffect } from 'react'
import {
  Home,
  Menu,
  X,
  UserPlus,
  Scan,
  Truck,
  Printer,
} from 'lucide-react'

// Custom retro visual components
const RetroButton = ({ onClick, children, className, ariaLabel }: any) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`
      px-3 py-2 
      bg-[var(--paper-bg)] 
      border-2 border-[var(--ink-black)] 
      shadow-[3px_3px_0px_var(--ink-black)]
      hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
      transition-all duration-150 ease-out
      flex items-center gap-2
      font-bold
      ${className}
    `}
  >
    {children}
  </button>
)


export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <>
      <header className="p-4 flex items-center justify-between border-b-2 border-[var(--ink-black)] bg-[var(--paper-bg)] sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <RetroButton
            onClick={() => setIsOpen(true)}
            ariaLabel="Open menu"
          >
            <Menu size={24} />
          </RetroButton>

          <h1 className="text-3xl" style={{ fontFamily: 'Rye, serif' }}>
            <Link to="/" className="hover:underline decoration-[var(--sign-red)] decoration-4 underline-offset-4 transition-all">
              SQUARE TOOLS
            </Link>
          </h1>
        </div>

        {/* Decorative corner element */}
        <div className="hidden md:block text-xs font-mono border border-[var(--ink-black)] p-1 px-2 rotate-2">
          EST. 2025
        </div>
      </header>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-[var(--ink-black)]/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-[var(--paper-bg)] border-r-4 border-[var(--ink-black)] z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        style={{ backgroundImage: 'var(--paper-texture)' }}
      >
        <div className="flex items-center justify-between p-4 border-b-2 border-[var(--ink-black)] border-dashed">
          <h2 className="text-xl font-bold font-mono uppercase tracking-widest">Navigation</h2>
          <RetroButton
            onClick={() => setIsOpen(false)}
            ariaLabel="Close menu"
          >
            <X size={24} />
          </RetroButton>
        </div>

        <nav className="flex-1 p-6 overflow-y-auto space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 transition-all font-bold text-lg group"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 border-2 border-[var(--ink-black)] bg-[var(--sign-blue)] shadow-[4px_4px_0px_var(--ink-black)] mb-2',
            }}
          >
            <Home size={20} className="group-hover:rotate-12 transition-transform" />
            <span>HOME</span>
          </Link>

          <Link
            to="/sign-maker"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 transition-all font-bold text-lg group"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 border-2 border-[var(--ink-black)] bg-[var(--sign-blue)] shadow-[4px_4px_0px_var(--ink-black)] mb-2',
            }}
          >
            <Printer size={20} className="group-hover:rotate-12 transition-transform" />
            <span>SIGN MAKER</span>
          </Link>

          <Link
            to="/scan"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 transition-all font-bold text-lg group"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 border-2 border-[var(--ink-black)] bg-[var(--sign-blue)] shadow-[4px_4px_0px_var(--ink-black)] mb-2',
            }}
          >
            <Scan size={20} className="group-hover:rotate-12 transition-transform" />
            <span>SCANNER</span>
          </Link>

          <Link
            to="/tracking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 transition-all font-bold text-lg group"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 border-2 border-[var(--ink-black)] bg-[var(--sign-blue)] shadow-[4px_4px_0px_var(--ink-black)] mb-2',
            }}
          >
            <Truck size={20} className="group-hover:rotate-12 transition-transform" />
            <span>TRANSFER TRACKER</span>
          </Link>

          {!session && (
            <Link
              to="/signup"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 border-2 border-transparent hover:border-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 transition-all font-bold text-lg group"
              activeProps={{
                className:
                  'flex items-center gap-3 p-3 border-2 border-[var(--ink-black)] bg-[var(--sign-blue)] shadow-[4px_4px_0px_var(--ink-black)] mb-2',
              }}
            >
              <UserPlus size={20} className="group-hover:rotate-12 transition-transform" />
              <span>SIGN UP</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t-2 border-[var(--ink-black)] border-dashed">
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              setIsOpen(false)
              window.location.href = '/login'
            }}
            className="w-full flex items-center justify-center gap-3 p-3 border-2 border-[var(--sign-red)] text-[var(--sign-red)] hover:bg-[var(--sign-red)] hover:text-[var(--paper-bg)] transition-colors font-bold uppercase tracking-wider"
          >
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
