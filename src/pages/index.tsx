import { type NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <section className="height-screen-helper flex items-center">
      <div className="mx-auto -mt-16 max-w-6xl px-5 sm:px-6">
        <div className="sm:flex sm:flex-col sm:items-center">
          <h1 className="text-[40px] font-extrabold leading-[45px] text-white xxs:text-4xl xs:text-6xl sm:text-center sm:text-7xl lg:text-8xl">
            Visualize metrics
            <br />
            <span className="text-blue-500">the easy way</span>
          </h1>
          <p className="m-auto mt-10 mb-16  text-lg text-zinc-300 sm:max-w-2xl sm:text-center sm:text-xl lg:text-2xl">
            Post and visualize all your data in one place with Metrics
          </p>

          <Link href="/dashboard" className="btn btn-primary">
            TRY METRICS FOR FREE
          </Link>
          <p className="mb-8 mt-3 text-sm text-zinc-400">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  )
}

export default Home
