import { type NextPage } from 'next'
import Head from 'next/head'
import { useSession } from 'next-auth/react'

import { useRouter } from 'next/router'
import Loading from '../components/ui/loading'
import MetricsList from '../components/metrics-list'
import CreateMetric from '../components/create-metric'
import VisualizeMetric from '../components/visualize-metric'
import { useState } from 'react'

const Dashboard: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const [selectedMetric, setSelectedMetric] = useState<
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
      <section className="height-screen-helper mx-auto flex border-t border-zinc-400">
        <div className="flex flex-1 flex-col lg:flex-row">
          <div className="lg:height-screen-helper h-[40vh] overflow-y-auto px-2 py-4 lg:w-[300px] lg:overflow-y-scroll lg:px-4 lg:py-6">
            <CreateMetric setSelectedMetric={setSelectedMetric} />
            <div className=" ">
              <MetricsList
                setSelectedMetric={setSelectedMetric}
                selectedMetric={selectedMetric}
              />
            </div>
          </div>

          <div className="flex-1 bg-zinc-800 py-4 px-2 lg:py-6 lg:px-10">
            {selectedMetric && (
              <VisualizeMetric
                metricId={selectedMetric.id}
                metricName={selectedMetric.name}
                setSelectedMetric={setSelectedMetric}
              />
            )}
            {!selectedMetric && (
              <div className="flex h-full flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-zinc-400">
                  Select or create a metric
                </h1>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Dashboard
