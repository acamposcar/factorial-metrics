import { useRef, useState } from 'react'
import { trpc } from '../utils/trpc'
import Dropzone from './dropzone'
import Modal from './ui/modal'
import Papa from 'papaparse'

const CreateMetric = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  // The user must select if he wants to create only one value for the metric or
  // upload a CSV file with multiple values
  const [isIndividualMetric, setIsIndividualMetric] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const unitRef = useRef<HTMLInputElement>(null)
  const valueRef = useRef<HTMLInputElement>(null)
  const timeRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | undefined>()

  const utils = trpc.useContext()
  const setValue = trpc.value.setValue.useMutation({
    onSuccess: async (metricId) => {
      utils.metric.getMetric.invalidate({ metricId })
    },
    onError: () => {
      toast.error('Error setting the values. Please, try again later')
    }
  })

  const setMultipleValues = trpc.value.setMultipleValues.useMutation({
    onSuccess: async () => {
      utils.metric.getMetrics.invalidate()
    },
    onError: () => {
      toast.error('Error setting the values. Please, try again later')
    }
  })

  const createMetric = trpc.metric.createMetric.useMutation({
    onSuccess: async ({ id }) => {
      utils.metric.getMetrics.invalidate()
      handleSetValues(id)
      handleModalClose()
    },
    onError: () => {
      toast.error('Error creating the metric. Please, try again later')
    }
  })

  const handleSetValues = async (metricId: string) => {
    if (isIndividualMetric) {
      await setValue.mutate({
        metricId,
        value: parseFloat(valueRef.current?.value),
        timestamp: new Date(timeRef.current?.value)
      })
    } else {
      const values = parseCSV(metricId)
      if (values) {
        setMultipleValues.mutate({
          values,
          metricId
        })
      }
    }
  }

  const parseCSV = (metricId: string) => {
    // Parse the CSV file and return an array of values
    if (!selectedFile) return

    try {
      let values: (
        | { metricId: string; value: number; timestamp: Date }
        | undefined
      )[] = []
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          // Get the values from the CSV file
          const data = results.data as { [key: string]: string }[]

          // Transform the values to the correct format
          values = data.map((row) => {
            if (row.value && row.timestamp) {
              return {
                metricId,
                value: parseFloat(row.value),
                timestamp: new Date(row.timestamp)
              }
            }
          })
        }
      })
      return values
    } catch (e) {
      // toast.error(
      //   'Error reading the CSV file. Please, try again with another file'
      // )
      console.log(e)
    }
  }

  const handleFileSelection = (file: File) => {
    setSelectedFile(file)
  }

  const handleModalClose = () => {
    setModalIsOpen(false)
    setSelectedFile(undefined)
  }

  const handleCreateMetric = () => {
    createMetric.mutate({
      name: nameRef.current?.value,
      unit: unitRef.current?.value,
      isPublic: false
    })
  }

  return (
    <>
      <button
        className="btn btn-primary mt-4"
        onClick={() => setModalIsOpen(true)}
      >
        CREATE METRIC
      </button>
      <Modal
        isOpen={modalIsOpen}
        title="Create a new metric"
        buttonText="Create Metric"
        handleClick={handleCreateMetric}
        handleClose={handleModalClose}
        isLoading={createMetric.isLoading || setValue.isLoading}
      >
        <form className="mt-4">
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium  ">
              Name
            </label>
            <input
              type="text"
              id="name"
              ref={nameRef}
              className="block w-full rounded-lg border border-zinc-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Google Stock"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="unit" className="mb-2 block text-sm font-medium  ">
              Unit
            </label>
            <input
              type="text"
              id="unit"
              ref={unitRef}
              className="block w-full rounded-lg border border-zinc-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. $"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium  ">
              Select a mode
            </label>
            <div className="mb-6 flex justify-between gap-2">
              <button
                type="button"
                className={`btn flex flex-1 items-center justify-center gap-2 border-2 text-sm ${
                  isIndividualMetric
                    ? 'border-blue-500 text-blue-500 hover:bg-zinc-700'
                    : 'border-zinc-400 text-zinc-400 hover:bg-zinc-700'
                } `}
                onClick={() => setIsIndividualMetric(true)}
              >
                {isIndividualMetric && <CheckIcon />}
                <span>Add one value</span>
              </button>
              <button
                type="button"
                className={`btn flex flex-1 items-center justify-center gap-2 border-2 text-sm ${
                  !isIndividualMetric
                    ? 'border-blue-500 text-blue-500 hover:bg-zinc-700'
                    : 'border-zinc-400 text-zinc-400 hover:bg-zinc-700'
                } `}
                onClick={() => setIsIndividualMetric(false)}
              >
                {!isIndividualMetric && <CheckIcon />}
                <span>Add multiple values</span>
              </button>
            </div>
          </div>
          {!isIndividualMetric && (
            <div className="mb-6">
              <label
                htmlFor="dropzone"
                className="mb-2 block text-sm font-medium  "
              >
                Upload a CSV file
              </label>
              <Dropzone
                selectedFile={selectedFile}
                handleFileSelection={handleFileSelection}
              />
            </div>
          )}
          {isIndividualMetric && (
            <>
              <div className="mb-6">
                <label
                  htmlFor="value"
                  className="mb-2 block text-sm font-medium  "
                >
                  Value
                </label>
                <input
                  type="number"
                  id="value"
                  ref={valueRef}
                  className="block w-full rounded-lg border border-zinc-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 107.57"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium  "
                >
                  Timestamp
                </label>
                <input
                  type="datetime-local"
                  id="time"
                  ref={timeRef}
                  className="block w-full rounded-lg border border-zinc-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 107.57"
                  required
                  step={1}
                />
              </div>
            </>
          )}
        </form>
      </Modal>
    </>
  )
}

export default CreateMetric

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-check-circle"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)
