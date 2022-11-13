import type { ReactNode } from 'react'
import Navbar from './navbar'
import Head from 'next/head'

interface Props {
  children: ReactNode
}

const Layout = ({ children }: Props) => {
  const title = 'Factorial Metrics'

  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:${process.env.PORT ?? 3000}`
  const description =
    'Post and visualize your data in a usable way with Factorial Metrics'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="robots" content="follow, index" />
        <meta name="description" content={description} />
        <meta name="theme-color" content="#ffffff" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta name="og:title" content={title} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={`${host}/social.jpg`} />
        <meta property="og:url" content={host} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@factorialmetrics" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={`${host}/social.jpg`} />
      </Head>
      <Navbar />
      <main id="skip">{children}</main>
    </>
  )
}

export default Layout
