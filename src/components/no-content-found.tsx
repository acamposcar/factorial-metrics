import Image from 'next/image'
import NoContentSVG from '../assets/not-found.svg'

interface Props {
  children?: React.ReactNode
  title: string
}

const NoContentFound = ({ children, title }: Props) => {
  return (
    <div className="mt-4 flex flex-col items-center justify-center gap-4 text-center lg:mt-16">
      <Image
        src={NoContentSVG}
        priority
        width={150}
        alt="No content found"
        className="hidden lg:block"
      />
      <h2 className="text-default mt-4 text-lg sm:text-xl">{title}</h2>
      {children && (
        <div className="text-offset text-center text-sm">{children}</div>
      )}
    </div>
  )
}

export default NoContentFound
