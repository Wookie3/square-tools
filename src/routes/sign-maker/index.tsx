import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { InventoryItem } from '@/types/inventory.types'
import SKUSearch from '@/components/sign-maker/SKUSearch'
import LabelPreview from '@/components/sign-maker/LabelPreview'
import PrintableSheet from '@/components/sign-maker/PrintableSheet'
import Header from '@/components/sign-maker/Header'

export const Route = createFileRoute('/sign-maker/')({
  beforeLoad: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: App,
})

function App() {
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  const [labels, setLabels] = useState<InventoryItem[]>([])

  const handleItemFound = (item: InventoryItem) => {
    setCurrentItem(item)
  }

  const handleAddToSheet = (item: InventoryItem, quantity: number) => {
    const newLabels = Array(quantity).fill(item)
    const totalLabels = labels.length + newLabels.length

    if (totalLabels > 4) {
      alert('Cannot add more than 4 labels to a sheet')
      return
    }

    setLabels([...labels, ...newLabels])
  }

  const handleClearSheet = () => {
    setLabels([])
  }

  return (
    <div className="retro-mode min-h-screen">
      <Header />
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center border-b-4 border-[var(--ink-black)] pb-4 mb-8">
            <h1 className="text-6xl font-black text-[var(--ink-black)] tracking-tighter uppercase drop-shadow-[4px_4px_0px_rgba(255,255,255,0.5)]">
              The BOH Sign Maker
            </h1>
            <p className="mt-2 font-mono text-lg font-bold uppercase tracking-widest text-[var(--sign-red)]">
              ★ Est. Model 2025 ★
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Search and Preview */}
            <div className="flex flex-col gap-8">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-12 h-12 bg-[var(--sign-blue)] rounded-full border-2 border-[var(--ink-black)] flex items-center justify-center font-bold text-xl z-10 shadow-[2px_2px_0px_var(--ink-black)]">
                  1
                </div>
                <SKUSearch onItemFound={handleItemFound} />
              </div>

              {currentItem && (
                <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="absolute -left-4 -top-4 w-12 h-12 bg-[var(--sign-red)] text-white rounded-full border-2 border-[var(--ink-black)] flex items-center justify-center font-bold text-xl z-10 shadow-[2px_2px_0px_var(--ink-black)]">
                    2
                  </div>
                  <LabelPreview
                    item={currentItem}
                    onAddToSheet={handleAddToSheet}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Printable Sheet */}
            <div className="relative">
              <div className="absolute -right-4 -top-4 w-12 h-12 bg-[var(--ink-black)] text-[var(--paper-bg)] rounded-full border-2 border-[var(--paper-bg)] flex items-center justify-center font-bold text-xl z-10 shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                3
              </div>
              <PrintableSheet
                labels={labels}
                onClear={handleClearSheet}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
