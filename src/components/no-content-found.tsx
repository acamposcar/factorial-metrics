import Image from 'next/image'
import NoContentSVG from '../assets/not-found.svg'

interface Props {
  children: React.ReactNode
}

const NoContentFound = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image src={NoContentSVG} priority width={250} alt="No content found" />
      {children}
    </div>
  )
}

export default NoContentFound
