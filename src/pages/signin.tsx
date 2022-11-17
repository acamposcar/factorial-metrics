import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import GitHub from '../components/icons/github'
import { signIn, useSession } from 'next-auth/react'
import Head from 'next/head'
import LoadingSpinner from '../components/ui/loading-spinner'
import Logo from '../components/icons/logo'

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // If authenticated, redirect to dashboard
    if (session) {
      router.replace('/dashboard')
    }
  }, [session, router])

  const handleSignIn = () => {
    setLoading(true)
    signIn('github', { callbackUrl: '/dashboard' })
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <section className="height-screen-helper flex items-center justify-center pb-24">
        <div className="flex w-80 max-w-lg flex-col justify-between p-3 ">
          <div className="flex flex-col items-center justify-center pb-12 ">
            <Logo width={70} height={70} />

            <h1 className="mt-8 text-3xl font-bold">Sign in to Metrics</h1>
          </div>
          <button className="btn btn-secondary btn-flex" onClick={handleSignIn}>
            {loading ? <LoadingSpinner /> : <GitHub />}
            <span className="ml-2 text-lg">Continue with Github</span>
          </button>
        </div>
      </section>
    </>
  )
}

export default SignIn
