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
      <section className="height-screen-helper flex items-center justify-center pb-24">
        <div className="flex w-80 max-w-lg flex-col justify-between p-3 ">
          <div className="flex justify-center pb-12 ">
            <h1 className="text-3xl font-bold">Sign in to Metrics</h1>
          </div>
          <button
            className="btn btn-secondary btn-flex"
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
