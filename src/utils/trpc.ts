import { httpBatchLink, loggerLink } from '@trpc/client'
import { createTRPCNext } from '@trpc/next'
import { type inferRouterInputs, type inferRouterOutputs } from '@trpc/server'
import superjson from 'superjson'
import { toast } from 'react-toastify'
import { QueryCache } from '@tanstack/react-query'
import { TRPCClientError } from '@trpc/client'
import { type AppRouter } from '../server/trpc/router/_app'
import { AnyAaaaRecord } from 'dns'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return '' // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}` // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}` // dev SSR should use localhost
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === 'development' ||
            (opts.direction === 'down' && opts.result instanceof Error)
        }),
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`
        })
      ],
      queryClientConfig: {
        defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
        queryCache: new QueryCache({
          onError: (error, query) => {
            // show error for background refetches
            if (query.state.data !== undefined) {
              toast.error('Ooops! Something went wrong')
              // TODO
              // if (error instanceof TRPCClientError) {
              //   toast.error(`Something went wrong: ${error.message}`)
              // } else {
              //   toast.error('Something went wrong')
              // }
            }
          }
        })
      }
    }
  },
  ssr: false
})

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>
