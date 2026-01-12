
import { createServerFn } from '@tanstack/react-start'
import { getShipmentStatus } from '../lib/purolator'
import { supabaseAdmin as supabase } from '../lib/supabase-server'

export const getTrackedShipments = createServerFn({ method: "GET" })
  .inputValidator((userId: string) => userId)
  .handler(async ({ data: userId }: { data: string }) => {
    const { data, error } = await supabase
      .from('user_shipments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  })

export const addShipment = createServerFn({ method: "POST" })
  .inputValidator((data: { pin: string; userId: string }) => data)
  .handler(async ({ data }: { data: { pin: string; userId: string } }) => {
    const { pin, userId } = data

    // 1. Check if already exists for this user
    const { data: existing } = await supabase
      .from('user_shipments')
      .select('id')
      .eq('pin', pin)
      .eq('user_id', userId)
      .maybeSingle()

    if (existing) {
      throw new Error('Shipment already tracked')
    }

    // 2. Fetch initial status
    const statusData = await getShipmentStatus(pin)
    // Extract relevant info from statusData.
    // The most useful info is in the lastEvent of the first package

    const shipmentData = (statusData as any)?.SearchResults?.SearchResult?.[0]?.Shipment
    const lastEvent = shipmentData?.packages?.package?.[0]?.lastEvent
    const statusText = lastEvent?.description || shipmentData?.status?.description || 'Initial Check'
    const statusCode = shipmentData?.status?.code || ''
    const delivered = statusCode.toLowerCase() === 'dld' || statusText.toLowerCase().includes('delivered')

    // 3. Insert into DB with user_id
    const { data: newShipment, error } = await supabase
      .from('user_shipments')
      .insert({
        user_id: userId,
        pin,
        status: statusText,
        last_checked_at: new Date().toISOString(),
        details: statusData,
        delivered: delivered
      })
      .select()
      .single()

    if (error) throw error
    return newShipment
  })

export const refreshShipment = createServerFn({ method: "POST" })
  .inputValidator((data: { id: string; userId: string }) => data)
  .handler(async ({ data }: { data: { id: string; userId: string } }) => {
    const { id, userId } = data

    const { data: shipment } = await supabase
      .from('user_shipments')
      .select('pin')
      .eq('id', id)
      .eq('user_id', userId)  // Ensure user owns this shipment
      .single()

    if (!shipment) throw new Error('Shipment not found')

    const statusData = await getShipmentStatus(shipment.pin)

    const shipmentData = (statusData as any)?.SearchResults?.SearchResult?.[0]?.Shipment
    const lastEvent = shipmentData?.packages?.package?.[0]?.lastEvent
    const statusText = lastEvent?.description || shipmentData?.status?.description || 'Unknown'
    const statusCode = shipmentData?.status?.code || ''
    const delivered = statusCode.toLowerCase() === 'dld' || statusText.toLowerCase().includes('delivered')

    const { error } = await supabase
      .from('user_shipments')
      .update({
        status: statusText,
        details: statusData,
        last_checked_at: new Date().toISOString(),
        delivered
      })
      .eq('id', id)
      .eq('user_id', userId)  // Ensure user can only update their own

    if (error) throw error
    return statusData
  })

export const checkDailyShipments = createServerFn({ method: "POST" })
  .handler(async () => {
    // Find undelivered shipments checked > 24h ago
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: shipments } = await supabase
      .from('user_shipments')
      .select('id, pin')
      .eq('delivered', false)
      .lt('last_checked_at', oneDayAgo)

    if (!shipments || shipments.length === 0) return { message: 'No shipments to update' }

    const results = []
    for (const s of shipments) {
      try {
        const statusData = await getShipmentStatus(s.pin)
        await supabase.from('user_shipments').update({
             details: statusData,
             last_checked_at: new Date().toISOString()
        }).eq('id', s.id)
        results.push({ id: s.id, status: 'Updated' })
      } catch (e) {
        results.push({ id: s.id, status: 'Failed', error: e instanceof Error ? e.message : String(e) })
      }
    }
    return results
  })
