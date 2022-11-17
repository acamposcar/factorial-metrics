import type { ReactNode } from 'react'
import Navbar from './navbar'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Loading from '../ui/loading'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const { status } = useSession()

  if (status === 'loading') {
    return <Loading />
  }

  const title = 'Metrics'

  const description = 'Post and analyze your data in a usable way with Metrics'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#000000" />
        <link href="/favicon.svg" rel="shortcut icon" />
      </Head>
      <Navbar />
      <main id="skip">{children}</main>
    </>
  )
}

export default Layout
