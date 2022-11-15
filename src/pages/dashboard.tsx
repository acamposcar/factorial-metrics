import { type NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { trpc } from '../utils/trpc'
import { useRouter } from 'next/router'
import Loading from '../components/ui/loading'
import MetricsTable from '../components/metrics-table'
import CreateMetric from '../components/create-metric'
import VisualizeMetric from '../components/visualize-metric'
import { useState } from 'react'

const Dashboard: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [metricData, setMetricData] = useState<
    { name: string; id: string } | undefined
  >()

  if (!session) {
    // Redirect to sign in page if not authenticated
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
            <CreateMetric />
            <MetricsTable setMetricData={setMetricData} />
            {metricData && (
              <VisualizeMetric
                metricId={metricData.id}
                metricName={metricData.name}
              />
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard
