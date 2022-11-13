import Link from 'next/link'
import Logo from '../icons/logo'
import { signIn, signOut, useSession } from 'next-auth/react'

const Navbar = () => {
  const { data: sessionData } = useSession()

  const linkStyle =
    'rounded-md p-1 font-medium text-zinc-800 transition duration-75 ease-in-out hover:text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'

  return (
    <nav>
      <a href="#skip" className="sr-only focus:not-sr-only">
        Skip to content
      </a>
      <div className="mx-auto max-w-6xl px-6">
        <div className="align-center relative flex flex-row justify-between py-4 md:py-6">
          <div className="flex flex-1 items-center gap-3">
            <Link href="/" className="hover:scale-105" aria-label="Logo">
              <Logo />
            </Link>
          </div>

          <nav className="flex flex-1 items-center justify-end space-x-8">
            {sessionData && (
              <>
                <Link href="/dashboard" className={linkStyle}>
                  Dashboard
                </Link>

                <button
                  className={linkStyle}
                  onClick={() => signOut({ callbackUrl: '/signin' })}
                >
                  Sign out
                </button>
              </>
            )}
            {!sessionData && (
              <Link href="/signin" className={linkStyle}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </div>
    </nav>
  )
}

export default Navbar