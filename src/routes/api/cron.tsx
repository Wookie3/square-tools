import { createFileRoute } from '@tanstack/react-router'
import { checkDailyShipments } from '@/server/tracking'

export const Route = createFileRoute('/api/cron')({
  loader: async () => {
    try {
      const results = await checkDailyShipments()
      return { success: true, results }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  },
})
