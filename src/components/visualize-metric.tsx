import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import type { Value } from '@prisma/client'
import { trpc } from '../utils/trpc'
import calculateAverage, { GroupBy } from '../utils/calculate-average'
import type { ValueData } from '../utils/calculate-average'
import { useState } from 'react'

interface Props {
  metricId: string
  metricName: string
}

const VisualizeMetric = ({ metricId, metricName }: Props) => {
  const [groupBy, setGroupBy] = useState(GroupBy.Second)
  const {
    data: metric,
    isLoading,
    isError
  } = trpc.metric.getMetric.useQuery({ metricId })

  const values = metric?.values
  const average = values ? calculateAverage(values, groupBy) : undefined
  return (
    <div className="h-full w-full">
      <h1>{metricName}</h1>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row">
          <button
            className="btn btn-primary"
            onClick={() => setGroupBy(GroupBy.Second)}
          >
            Second
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setGroupBy(GroupBy.Minute)}
          >
            Minute
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setGroupBy(GroupBy.Hour)}
          >
            Hour
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setGroupBy(GroupBy.Day)}
          >
            Day
          </button>
        </div>
      </div>

      {isLoading && <div>Loading...</div>}
      {!values && !isLoading && <p>Select a metric</p>}
      {average && !isLoading && <RenderLineChart values={average} />}
    </div>
  )
}

export default VisualizeMetric

const RenderLineChart = ({ values }: { values: ValueData[] }) => (
  <LineChart
    width={600}
    height={300}
    data={values.map((value) => ({
      timestamp: value.timestamp.toUTCString(),
      value: value.value.toFixed(2)
    }))}
    margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
  >
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="timestamp" />
    <YAxis />
    <Tooltip />
  </LineChart>
)
