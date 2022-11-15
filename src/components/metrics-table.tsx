import { trpc } from '../utils/trpc'
import Link from 'next/link'
import { Table, TD, TH, THead, TR } from './ui/table'
import NoContentFound from './no-content-found'
import { useState } from 'react'
import CreateMetric from './create-metric'
import Loading from './ui/loading'
import Image from 'next/image'
import ErrorSVG from '../assets/notify-illustration.svg'

interface Props {
  setMetricData: ({ name, id }: { name: string; id: string }) => void
}

const MetricsTable = ({ setMetricData }: Props) => {
  const {
    data: metrics,
    isError,
    isLoading
  } = trpc.metric.getMetrics.useQuery()

  if (isLoading) return <Loading />

  if (isError && !metrics) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src={ErrorSVG} width={300} height={300} alt="" />
        <h2 className=" text-default text-2xl">Ooops! Something went wrong!</h2>
        <p className=" text-offset">Please, try again later</p>
      </div>
    )
  }

  return (
    <>
      {metrics && metrics.length === 0 && (
        <NoContentFound>
          <p className=" text-default mt-4 text-xl">Ooops! No metrics found</p>
          <div className="text-offset text-center text-sm">
            <p>Do you want to visualize and analyze your data?</p>
            <p>Create a new metric to get started!</p>
          </div>
          <CreateMetric />
        </NoContentFound>
      )}
      {metrics && metrics.length > 0 && (
        <Table>
          <THead>
            <tr>
              <TH>Name</TH>
              <TH>Units</TH>
              <TH>Action</TH>
            </tr>
          </THead>
          <tbody>
            {metrics.map((metric) => {
              return (
                <TR key={metric.id}>
                  <TD>
                    <Link
                      href={`/metrics/${metric.id}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {metric.name}
                    </Link>
                  </TD>
                  <TD>{metric.unit}</TD>
                  <TD className="capitalize">
                    <button
                      onClick={() =>
                        setMetricData({ id: metric.id, name: metric.name })
                      }
                    >
                      SHOW
                    </button>
                  </TD>
                </TR>
              )
            })}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default MetricsTable
