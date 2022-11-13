import { useState } from 'react'
import type { FileRejection } from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

interface Props {
  selectedFile: File | undefined
  handleFileSelection: (file: File) => void
}

const Dropzone = ({ selectedFile, handleFileSelection }: Props) => {
  const [error, setError] = useState<string | undefined>()
  const SIZE_LIMIT_MB = 2

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      setError(undefined)
      // If there are rejected files, show the first error
      if (rejectedFiles[0] && rejectedFiles[0].errors[0]) {
        if (rejectedFiles[0].errors[0].code === 'file-too-large') {
          setError(`Please upload a file smaller than ${SIZE_LIMIT_MB}MB.`)
          return
        }
        if (rejectedFiles[0].errors[0].code === 'file-invalid-type') {
          setError(`Please upload a CSV file.`)
          return
        }
        if (rejectedFiles[0].errors[0].code === 'too-many-files-') {
          setError(`Please upload only one file.`)
          return
        }
        setError(rejectedFiles[0].errors[0].message)
        return
      }
      const file = acceptedFiles[0]
      if (!file) {
        return
      }
      handleFileSelection(file)
    },
    [handleFileSelection]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1,
    maxSize: SIZE_LIMIT_MB * 1024 * 1024,
    onDrop
  })

  return (
    <div
      className="mt-3 flex w-full items-center justify-center"
      {...getRootProps()}
    >
      <div
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg  border-2 border-dashed bg-zinc-700 hover:border-gray-500 hover:bg-gray-800 ${
          isDragActive ? 'border-bluish-500' : 'border-gray-400'
        } `}
      >
        <div
          className={`flex flex-col items-center justify-center gap-4 pt-5 pb-6`}
        >
          <svg
            aria-hidden="true"
            className="h-10 w-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <div>
            {selectedFile ? (
              <p className="mb-2 text-lg text-gray-200 ">{selectedFile.name}</p>
            ) : (
              <>
                <p className="mb-2 text-center text-sm font-medium text-gray-400">
                  Select or drop a a file with data
                </p>
                <p className="text-center text-xs text-gray-400">
                  CSV (MAX. {SIZE_LIMIT_MB} MB)
                </p>
              </>
            )}
            <p className="mt-2 text-red-500">{error}</p>
          </div>
        </div>
        <input id="dropzone" {...getInputProps()} />
      </div>
    </div>
  )
}

export default Dropzone
