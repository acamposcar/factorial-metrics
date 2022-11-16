import { trpc } from '../utils/trpc'
import Loading from './ui/loading'
import NoContentFound from './no-content-found'
import SomethingWentWrong from './something-went-wrong'

interface Props {
  setSelectedMetric: ({ name, id }: { name: string; id: string }) => void
  selectedMetric: { name: string; id: string } | undefined
}

const MetricsList = ({ setSelectedMetric, selectedMetric }: Props) => {
  const {
    data: metrics,
    isError,
    isLoading
  } = trpc.metric.getMetrics.useQuery()

  if (isLoading) return <Loading className="mt-6" />

  if (isError && !metrics) {
    return <SomethingWentWrong />
  }

  if (!metrics || metrics.length === 0) {
    return (
      <NoContentFound title="Ooops! No metrics found">
        <p>Do you want to visualize and analyze your data?</p>
        <p>Create a new metric to get started!</p>
      </NoContentFound>
    )
  }
  return (
    <ul className="mx-auto mt-8 max-w-xs ">
      {metrics.map((metric) => {
        return (
          <li key={metric.id} className=" ">
            <button
              className={`w-full whitespace-nowrap rounded-md py-3 px-6 hover:bg-zinc-800 lg:text-left ${
                selectedMetric?.id === metric.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400'
              }`}
              onClick={() =>
                setSelectedMetric({ name: metric.name, id: metric.id })
              }
            >
              {metric.name.length > 19
                ? metric.name.slice(0, 19) + '...'
                : metric.name}
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default MetricsList
