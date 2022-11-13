import { type NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import Loading from '../components/ui/loading'

const Dashboard: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/signin')
    return <Loading />
  }
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <section className="height-screen-helper flex items-center">
        <div className="mx-auto -mt-16 max-w-6xl px-5 sm:px-6">
          <div className="sm:flex sm:flex-col sm:items-center">
            <p>{session?.user?.name}</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard
