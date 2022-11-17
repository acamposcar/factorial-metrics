import { Fragment, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import LoadingSpinner from './loading-spinner'

interface Props {
  children: React.ReactNode
  title: string
  description?: string
  isOpen: boolean
  buttonText: string
  handleClose: () => void
  isLoading: boolean
}

const Modal = ({
  isOpen,
  children,
  title,
  buttonText,
  description,
  handleClose,
  isLoading
}: Props) => {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={handleClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full  items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative max-h-[90vh] transform overflow-y-auto rounded-lg  bg-zinc-800  text-left text-zinc-200 shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
                <div className=" px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 "
                      >
                        {title}
                      </Dialog.Title>
                      {description && (
                        <div className="mt-2">
                          <p className="text-sm text-zinc-300">{description}</p>
                        </div>
                      )}
                      <div className="mt-2">{children}</div>
                    </div>
                  </div>
                </div>
                <div className=" mb-4 flex flex-row-reverse items-center justify-start gap-2 px-4 py-3 sm:px-6">
                  <button
                    form="create"
                    type="submit"
                    className="btn btn-primary btn-flex"
                  >
                    {isLoading && <LoadingSpinner />}
                    {buttonText}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
