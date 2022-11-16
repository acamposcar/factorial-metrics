import type { FormEvent } from 'react'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import Dropzone from './dropzone'
import Modal from './ui/modal'
import Papa from 'papaparse'
import { toast } from 'react-toastify'

interface ParseValues {
  value: number
  timestamp: Date
}
const CreateMetric = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [parseError, setParseError] = useState(false)
  // The user must select if he wants to create only one value for the metric or
  // upload a CSV file with multiple values
  const [isIndividualMetric, setIsIndividualMetric] = useState(false)
  const [csvValues, setCsvValues] = useState<ParseValues[]>([])

  const [name, setName] = useState<string | undefined>()
  const [unit, setUnit] = useState<string | undefined>()
  const [value, setValue] = useState<number | undefined>()
  const [timestamp, setTimestamp] = useState<Date | undefined>()
  const [selectedFile, setSelectedFile] = useState<File | undefined>()

  const [formValidationError, setFormValidationError] = useState(false)
  const utils = trpc.useContext()
  const createIndividualValue = trpc.value.setValue.useMutation({
    onSuccess: async (metricId) => {
      utils.metric.getMetric.invalidate({ metricId })
    },
    onError: () => {
      toast.error('Error setting the values. Please, try again')
    }
  })

  const createMultipleValues = trpc.value.setMultipleValues.useMutation({
    onSuccess: async () => {
      utils.metric.getMetrics.invalidate()
    },
    onError: () => {
      toast.error('Error setting the values. Please, try again')
    }
  })

  const createMetric = trpc.metric.createMetric.useMutation({
    onSuccess: async ({ id }) => {
      utils.metric.getMetrics.invalidate()
      // This must be called here because the mutate function
      // has no return, and we need the metric id
      handleCreateValues(id)
      handleModalClose()
    },
    onError: () => {
      toast.error('Error creating the metric. Please, try again')
    }
  })

  const handleCreateValues = async (metricId: string) => {
    setFormValidationError(false)

    if (isIndividualMetric) {
      // If the user wants to create only one value for the metric
      if (!metricId || !value || !timestamp) {
        setFormValidationError(true)
        return
      }
      await createIndividualValue.mutate({
        metricId,
        value,
        timestamp
      })
    } else {
      // Multiple values - the user is uploading a CSV file
      if (!metricId || !csvValues || csvValues.length === 0) {
        setFormValidationError(true)
        return
      }

      createMultipleValues.mutate({
        values: [...csvValues].map((obj) => ({
          ...obj,
          metricId
        })),
        metricId
      })
    }
  }

  const parseCSV = () => {
    // Parse the CSV file and return an array of values
    setParseError(false)
    if (!selectedFile) return

    let values: ParseValues[] = []
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // Get the values from the CSV file
        const data = results.data as { [key: string]: string }[]

        // Transform the values to the correct format
        values = data.map((row) => {
          if (!row.value || !row.timestamp) {
            throw new Error('Invalid CSV file')
          }
          return {
            value: parseFloat(row.value),
            timestamp: new Date(row.timestamp)
          }
        })
      }
    })
    return values
  }

  const handleFileSelection = (file: File) => {
    // Parse the CSV file and check if it is valid
    // If it is valid, set the values to the state
    let values: ParseValues[] | undefined = []
    try {
      values = parseCSV()
      if (!values || values.length === 0) {
        throw new Error('No data found in the CSV')
      }
      setCsvValues(values)
    } catch (error) {
      setParseError(true)
      return
    }
    setSelectedFile(file)
  }

  const handleCreateMetric = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormValidationError(false)
    // TODO Handle Errors
    const noNameNoUnit = !name || !unit
    const noValueNoTimestamp = !value || !timestamp
    const noCsvValues = !csvValues || csvValues.length === 0

    // Validate form
    if (noNameNoUnit) {
      setFormValidationError(true)
      return
    }
    if (isIndividualMetric && noValueNoTimestamp) {
      setFormValidationError(true)
      return
    }
    if (!isIndividualMetric && noCsvValues) {
      setFormValidationError(true)
      return
    }

    createMetric.mutate({
      name,
      unit,
      isPublic: false
    })
  }

  const handleModalClose = () => {
    // Reset the state when the modal is closed
    setModalIsOpen(false)
    setSelectedFile(undefined)
    setCsvValues([])
    setName(undefined)
    setUnit(undefined)
    setValue(undefined)
    setTimestamp(undefined)
    setParseError(false)
    setFormValidationError(false)
  }

  return (
    <>
      <div className="mt-4 flex justify-center">
        <button
          className="btn btn-primary"
          onClick={() => setModalIsOpen(true)}
        >
          CREATE METRIC
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        title="Create a new metric"
        buttonText="Create Metric"
        handleClose={handleModalClose}
        isLoading={
          createMetric.isLoading ||
          createIndividualValue.isLoading ||
          createMultipleValues.isLoading
        }
      >
        <form id="create" className="mt-4" onSubmit={handleCreateMetric}>
          <div className="mb-6">
            <label htmlFor="name" className="mb-2 block text-sm font-medium  ">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
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
                parseError={parseError}
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
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
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
                  onChange={(e) => setTimestamp(new Date(e.target.value))}
                  className="block w-full rounded-lg border border-zinc-600 bg-zinc-700  p-2.5 text-sm text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g. 107.57"
                  required
                  step={1}
                />
              </div>
            </>
          )}
        </form>
        {formValidationError && (
          <div className="mt-4 text-red-500">
            There was an error with your form. Please check the fields and try
            again
          </div>
        )}
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
