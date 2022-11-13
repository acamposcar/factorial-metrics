import { type NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import Loading from '../components/loading'

const Dashboard: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    router.push('/signin')
    return <Loading />
  }
  return <p>{session?.user?.name}</p>
}

export default Dashboard
