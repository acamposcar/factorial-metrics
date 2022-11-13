import { z } from 'zod'

import { router, protectedProcedure } from '../trpc'

export const metricRouter = router({
  getMetrics: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.metric.findMany()
  }),
  getMetric: protectedProcedure
    .input(z.object({ metricId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.metric.findUnique({
        where: {
          id: input.metricId
        },
        include: {
          values: true
        }
      })
    }),
  createMetric: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        unit: z.string(),
        isPublic: z.boolean()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.metric.create({
        data: {
          name: input.name,
          unit: input.unit,
          userId: ctx.session.user.id,
          isPublic: input.isPublic
        }
      })
    }),
  deleteMetric: protectedProcedure
    .input(
      z.object({
        metricId: z.string()
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.metric.delete({
        where: {
          id: input.metricId
        }
      })
    })
})
