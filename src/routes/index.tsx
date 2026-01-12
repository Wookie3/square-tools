import { createFileRoute, Link } from '@tanstack/react-router'
import { Printer, Scan, Truck } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a1628] p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-3 pt-8">
          <h1 className="text-5xl font-extrabold text-white tracking-tight">Square Tools</h1>
          <p className="text-xl text-slate-300 font-light">Unified Retail Operations Suite</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Sign Maker Button */}
          <Link to="/sign-maker" className="group block">
            <div className="w-full h-48 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
              rounded-none transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center space-y-4
              shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.15)]
              hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.2)]
              active:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.3),0_1px_2px_-1px_rgba(0,0,0,0.15)]
              active:translate-y-[2px]
              relative overflow-hidden">
              {/* Ripple effect overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

              <Printer className="w-16 h-16 text-white" strokeWidth={2} />
              <div className="text-center space-y-1 px-4">
                <p className="font-['Courier_Prime'] font-bold text-lg text-white uppercase tracking-wide">
                  Sign Printer
                </p>
                <p className="text-orange-100 text-sm font-medium">
                  Create BOH signage for "Shelf Talkers"
                </p>
              </div>
            </div>
          </Link>

          {/* Square Scan Button */}
          <Link to="/scan" className="group block">
            <div className="w-full h-48 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
              rounded-none transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center space-y-4
              shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.15)]
              hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.2)]
              active:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.3),0_1px_2px_-1px_rgba(0,0,0,0.15)]
              active:translate-y-[2px]
              relative overflow-hidden">
              {/* Ripple effect overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

              <Scan className="w-16 h-16 text-white" strokeWidth={2} />
              <div className="text-center space-y-1 px-4">
                <p className="font-sans font-black text-lg text-white uppercase tracking-tighter">
                  Square Scan
                </p>
                <p className="text-orange-100 text-sm font-medium">
                  Product Scanner
                </p>
              </div>
            </div>
          </Link>

          {/* Transfer Tracker Button */}
          <Link to="/tracking" className="group block">
            <div className="w-full h-48 bg-orange-500 hover:bg-orange-600 active:bg-orange-700
              rounded-none transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center space-y-4
              shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-1px_rgba(0,0,0,0.15)]
              hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.4),0_4px_6px_-2px_rgba(0,0,0,0.2)]
              active:shadow-[0_2px_4px_-1px_rgba(0,0,0,0.3),0_1px_2px_-1px_rgba(0,0,0,0.15)]
              active:translate-y-[2px]
              relative overflow-hidden">
              {/* Ripple effect overlay */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>

              <Truck className="w-16 h-16 text-white" strokeWidth={2} />
              <div className="text-center space-y-1 px-4">
                <p className="font-sans font-bold text-lg text-white uppercase tracking-wide">
                  Transfer Tracker
                </p>
                <p className="text-orange-100 text-sm font-medium">
                  Track outbound transfers
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  )
}
