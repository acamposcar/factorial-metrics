import { router } from '../trpc'
import { metricRouter } from './metric'
import { valueRouter } from './value'

export const appRouter = router({
  metric: metricRouter,
  value: valueRouter
})

// export type definition of API
export type AppRouter = typeof appRouter
