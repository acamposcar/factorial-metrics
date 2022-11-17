import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { router, protectedProcedure } from '../trpc'

export const valueRouter = router({
  setValue: protectedProcedure
    .input(
      z.object({
        metricId: z.string(),
        value: z.number(),
        timestamp: z.date()
      })
    )
    .mutation(async ({ ctx, input }) => {
      const metricOwner = await ctx.prisma.metricItem.findUnique({
        where: { id: input.metricId },
        select: { userId: true }
      })
      if (metricOwner?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to set value for this metric'
        })
      }
      await ctx.prisma.value.create({
        data: {
          metricId: input.metricId,
          value: input.value,
          timestamp: input.timestamp
        }
      })
      return input.metricId
    }),
  setMultipleValues: protectedProcedure
    .input(
      z.object({
        metricId: z.string(),
        values: z.array(
          z.object({
            value: z.number(),
            timestamp: z.date(),
            metricId: z.string()
          })
        )
      })
    )
    .mutation(async ({ ctx, input }) => {
      const metricOwner = await ctx.prisma.metricItem.findUnique({
        where: { id: input.metricId },
        select: { userId: true }
      })
      if (metricOwner?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Not authorized to set value for this metric'
        })
      }
      await ctx.prisma.value.createMany({
        data: input.values
      })
      return input.metricId
    })
})
