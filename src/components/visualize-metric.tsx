import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { trpc } from '../utils/trpc'
import calculateAverage, { GroupBy } from '../utils/calculate-average'
import type { ValueData } from '../utils/calculate-average'
import { useEffect, useState } from 'react'
import Loading from './ui/loading'
import NoContentFound from './no-content-found'
import SomethingWentWrong from './something-went-wrong'
import { toast } from 'react-toastify'
import LoadingSpinner from './ui/loading-spinner'
import { format } from 'date-fns'
interface Props {
  metricId: string
  metricName: string
  setSelectedMetric: (arg: undefined) => void
}

const VisualizeMetric = ({
  metricId,
  metricName,
  setSelectedMetric
}: Props) => {
  const [groupBy, setGroupBy] = useState(GroupBy.Second)
  const utils = trpc.useContext()

  const {
    data: metric,
    isLoading,
    isError
  } = trpc.metric.getMetric.useQuery({ metricId })

  const deleteMetric = trpc.metric.deleteMetric.useMutation({
    onSuccess: () => {
      setSelectedMetric(undefined)
      utils.metric.getMetric.invalidate({ metricId })
      utils.metric.getMetrics.invalidate()
    },
    onError: () => {
      toast.error('Error deleting the metric. Please, try again later')
    }
  })

  const values = metric?.values
  const averageValues = values ? calculateAverage(values, groupBy) : undefined

  const showError = isError && !averageValues
  const showGraph = !isLoading && averageValues && averageValues.length > 0
  const showNoValues = !isLoading && averageValues && averageValues.length === 0
  const showNoMetric = !isLoading && !averageValues

  const shortName =
    metricName.length > 13 ? metricName.slice(0, 13) + '...' : metricName

  const handleDelete = () => {
    deleteMetric.mutate({ metricId })
  }

  return (
    <>
      <div className="mb-10 flex items-center justify-between ">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-medium">
            {shortName} {metric?.unit && `(${metric.unit})`}
          </h1>
          <button className="text-red-600" onClick={handleDelete}>
            {deleteMetric.isLoading ? <LoadingSpinner /> : <TrashIcon />}
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex-row items-center gap-2 lg:flex">
            <label
              htmlFor="groupby"
              className="mb-2 block whitespace-nowrap text-center text-sm font-medium text-white"
            >
              Group by
            </label>
            <select
              id="groupby"
              onChange={(e) => setGroupBy(e.target.value as GroupBy)}
              className="block w-full rounded-lg border border-gray-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="second">Second</option>
              <option value="minute">Minute</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
            </select>
          </div>
        </div>
      </div>
      <div className="grid place-items-center overflow-hidden">
        {isLoading && <Loading className="mt-10" />}
        {showError && <SomethingWentWrong />}
        {showNoValues && (
          <NoContentFound title="Ooops! No values found for the selectd metric" />
        )}
        {showNoMetric && <NoContentFound title="Ooops! No metric found" />}
        {showGraph && (
          <RenderLineChart unit={metric?.unit ?? ''} values={averageValues} />
        )}
      </div>
    </>
  )
}

export default VisualizeMetric

const RenderLineChart = ({
  values,
  unit
}: {
  values: ValueData[] | undefined
  unit: string
}) => {
  // Get screen width
  const [width, setWidth] = useState(window.innerWidth)

  const getWindowSize = () => {
    const { innerWidth } = window
    return innerWidth
  }

  useEffect(() => {
    const handleWindowResize = () => {
      setWidth(getWindowSize())
    }
    // Add event listener to update state on window resize
    window.addEventListener('resize', handleWindowResize)
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [])

  return (
    <LineChart
      width={width > 1024 ? width / 2 : width / 1.2}
      height={width > 1024 ? width / 3.2 : width / 1.4}
      className="mr-6"
      data={values?.map((value) => ({
        timestamp: format(value.timestamp, 'LLL MM, yyyy HH:mm:ss'),
        value: value.value.toFixed(2),
        unit: unit
      }))}
      margin={{
        bottom: 120
      }}
    >
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        dot={<CustomizedDot />}
      />
      <XAxis dataKey="timestamp" tick={<CustomizedXAxisTick />} />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" stroke="#5E5E5E" />
      <Tooltip content={<CustomTooltip />} />
    </LineChart>
  )
}

const CustomTooltip = ({
  payload,
  label
}: {
  payload?: { value: string; payload: { unit: string } }[]
  label?: string
}) => {
  if (payload && payload[0]) {
    return (
      <div className="rounded-md bg-zinc-900 p-4">
        <p>📆 {label}</p>
        <p className="mt-2">
          📊 {payload[0].value} ({payload[0].payload.unit})
        </p>
      </div>
    )
  }

  return null
}

const CustomizedDot = ({ cx, cy }: { cx?: number; cy?: number }) => {
  if (!cx || !cy) return null
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      x={cx - 2}
      y={cy - 2}
    >
      <circle cx="2" cy="2" r="2" fill="#8884d8" />
    </svg>
  )
}

const CustomizedXAxisTick = ({
  x,
  y,
  payload
}: {
  x?: string
  y?: string
  payload?: { value: string }
}) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={30}
        y={30}
        dy={16}
        textAnchor="end"
        fill="#666"
        transform="rotate(-35)"
      >
        {payload?.value ?? ''}
      </text>
    </g>
  )
}

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-trash-2"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)
