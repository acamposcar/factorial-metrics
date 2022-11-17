import { z } from 'zod'

import { router, protectedProcedure } from '../trpc'

export const metricRouter = router({
  getMetrics: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.metricItem.findMany({
      where: {
        userId: ctx.session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }),
  getMetric: protectedProcedure
    .input(z.object({ metricId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.metricItem.findFirst({
        where: {
          userId: ctx.session.user.id,
          id: input.metricId
        },
        include: {
          values: {
            select: {
              timestamp: true,
              value: true
            }
          }
        }
      })
    }),
  createMetric: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        unit: z.string().optional(),
        isPublic: z.boolean()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.metricItem.create({
        data: {
          name: input.name,
          unit: input.unit ?? null,
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
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.metricItem.deleteMany({
        where: {
          userId: ctx.session.user.id,
          id: input.metricId
        }
      })
    })
})
