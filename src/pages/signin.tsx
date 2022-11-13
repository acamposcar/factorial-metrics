import { useRouter } from 'next/router'
import { useEffect } from 'react'
import GitHub from '../components/icons/github'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'

const SignIn = () => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.replace('/dashboard')
    }
  }, [session, router])

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <section className="mt-24 flex items-center justify-center">
        <div className=" flex w-96 max-w-lg flex-col justify-between p-3 ">
          <div className="flex justify-center pb-12 ">
            <h1 className="text-2xl font-bold">Sign in to Factorial Metrics</h1>
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-zinc-200 p-2 px-4 py-2 text-xl text-zinc-900 shadow-lg hover:bg-zinc-300"
            onClick={() => signIn('github', { callbackUrl: '/dashboard' })}
          >
            <GitHub />
            <span className="ml-2">Continue with Github</span>
          </button>
        </div>
      </section>
    </>
  )
}

export default SignIn
