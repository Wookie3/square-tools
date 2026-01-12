import { createFileRoute, useRouter, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { addShipment, getTrackedShipments, refreshShipment } from '@/server/tracking'
import { Loader2, RefreshCw, Plus, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Header from '@/components/tracking/Header'

export const Route = createFileRoute('/tracking/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/tracking'
        }
      })
    }
    return { userId: session.user.id }
  },
  component: TrackingPage,
  loader: ({ context }) => getTrackedShipments({ data: context.userId }),
})

function TrackingPage() {
  const shipments = Route.useLoaderData()
  const router = useRouter()
  const routeContext = Route.useRouteContext()
  const userId = routeContext.userId as string
  const [pin, setPin] = useState('')
  const [adding, setAdding] = useState(false)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin) return

    setAdding(true)
    setError(null)
    try {
      await addShipment({ data: { pin, userId } })
      setPin('')
      router.invalidate()
    } catch (err: any) {
      setError(err.message || 'Failed to add shipment')
    } finally {
      setAdding(false)
    }
  }

  const handleRefresh = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click if we add that later
    setRefreshingId(id)
    try {
      await refreshShipment({ data: { id, userId } })
      router.invalidate()
    } catch (err: any) {
      alert('Failed to refresh: ' + err.message)
    } finally {
      setRefreshingId(null)
    }
  }

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

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleAdd} className="mb-8 flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter Purolator PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full p-3 border-2 border-[var(--ink-black)] rounded-none shadow-[4px_4px_0px_var(--ink-black)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_var(--ink-black)] focus:outline-none transition-all"
                />
                {error && <p className="text-[var(--sign-red)] text-sm mt-1 font-bold">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={adding || !pin}
                className="bg-[var(--sign-blue)] text-white px-6 py-3 border-2 border-[var(--ink-black)] shadow-[4px_4px_0px_var(--ink-black)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_var(--ink-black)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-bold uppercase tracking-wider flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus className="w-5 h-5" />}
                Track
              </button>
            </form>

            <div className="grid gap-4">
              {shipments?.map((shipment) => {
                const details = shipment.details as any
                const shipmentData = details?.SearchResults?.SearchResult?.[0]?.Shipment
                const packageData = shipmentData?.packages?.package?.[0]
                const estimatedDelivery = packageData?.estimatedDeliveryDate

                return (
                  <div
                    key={shipment.id}
                    className="bg-white p-6 border-2 border-[var(--ink-black)] shadow-[4px_4px_0px_var(--ink-black)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_var(--ink-black)] transition-all flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-bold text-lg">{shipment.pin}</span>
                        {shipment.delivered && (
                          <span className="bg-green-100 text-green-800 border border-green-800 text-xs px-2 py-1 font-bold uppercase tracking-wider">
                            DELIVERED
                          </span>
                        )}
                        {!shipment.delivered && (
                          <span className="bg-yellow-100 text-yellow-800 border border-yellow-800 text-xs px-2 py-1 font-bold uppercase tracking-wider">
                            IN TRANSIT
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-gray-800 text-sm font-semibold">
                          {shipment.status || 'Unknown status'}
                        </p>

                        {estimatedDelivery && (
                          <p className="text-[var(--sign-blue)] text-xs font-bold font-mono">
                            📅 Est. Delivery: {new Date(estimatedDelivery).toLocaleDateString()}
                          </p>
                        )}

                        <p className="text-gray-400 text-xs font-mono">
                          Last check: {shipment.last_checked_at ? new Date(shipment.last_checked_at).toLocaleString() : 'Never'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRefresh(shipment.id, e)}
                      disabled={refreshingId === shipment.id}
                      className="p-2 text-[var(--ink-black)] hover:bg-[var(--sign-blue)]/20 border-2 border-transparent hover:border-[var(--ink-black)] rounded-none transition-all"
                      title="Refresh Status"
                    >
                      {refreshingId === shipment.id ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                      ) : (
                        <RefreshCw className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                )
              })}

              {shipments?.length === 0 && (
                <div className="text-center py-12 text-[var(--ink-black)] bg-[var(--paper-bg)] border-2 border-dashed border-[var(--ink-black)] opacity-60">
                  <Package className="w-12 h-12 mx-auto mb-3" />
                  <p className="font-mono font-bold">NO SHIPMENTS TRACKED YET</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
