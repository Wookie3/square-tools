import Header from './Header'

export default function TrackingApp() {
  return (
    <div className="retro-mode min-h-screen">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center border-b-4 border-[var(--ink-black)] pb-4 mb-8">
            <h1 className="text-6xl font-black text-[var(--ink-black)] tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]">
              Shipment Tracking
            </h1>
            <p className="mt-2 font-mono text-lg font-bold uppercase tracking-widest text-[var(--sign-red)]">
              ★ Inbound & Transfers ★
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[var(--ink-black)] bg-[var(--paper-bg)] opacity-60">
            <p className="font-mono text-xl font-bold uppercase tracking-widest text-[var(--ink-black)]">
              Tracking Interface Loading...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
