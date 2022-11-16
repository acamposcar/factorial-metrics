import Image from 'next/image'
import ErrorSVG from '../assets/something-went-wrong.svg'

const SomethingWentWrong = () => {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-4">
      <Image
        src={ErrorSVG}
        priority
        width={150}
        alt="Error. Something went wrong"
      />
      <h2 className=" text-default mt-4 text-xl">
        Ooops! Something went wrong
      </h2>
      <div className="text-offset text-center text-sm">
        <p>Please, try again later</p>
      </div>
    </div>
  )
}

export default SomethingWentWrong
