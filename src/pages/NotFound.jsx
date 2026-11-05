import { ArrowLeft, ArrowRight, Compass, WalletCards } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import PageTitle from '../components/PageTitle'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#faf8f6] px-4 py-10 text-[#252321] sm:px-6 sm:py-14">
      <PageTitle title="Page not found" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#f5dedb] opacity-60 blur-3xl sm:h-80 sm:w-80" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#f3e8d8] opacity-70 blur-3xl sm:h-96 sm:w-96" />

      <section className="relative w-full max-w-xl rounded-3xl border border-[#eeece9] bg-white/90 px-6 py-10 text-center shadow-[0_24px_80px_rgba(55,43,35,0.08)] backdrop-blur sm:px-12 sm:py-14">
        <Link to="/" aria-label="PocketKhata home" className="mx-auto mb-10 inline-flex items-center gap-2.5 rounded-xl text-left sm:mb-12">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#fff0ee] text-[#d94b42]">
            <WalletCards size={21} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Pocket<span className="text-[#d94b42]">Khata</span>
          </span>
        </Link>

        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-[#fff0ee] text-[#d94b42] sm:mb-7 sm:h-20 sm:w-20">
          <Compass size={34} strokeWidth={1.6} className="sm:h-10 sm:w-10" />
        </div>
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.22em] text-[#d94b42]">Error 404</p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">We can’t find that page</h1>
        <p className="mx-auto mb-8 max-w-md text-sm leading-6 text-[#77716b] sm:mb-9 sm:text-base sm:leading-7">
          The page may have moved, or the link might be out of date. Let’s get you back to somewhere familiar.
        </p>

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#e9e5e1] px-5 py-3 text-sm font-semibold text-[#514c47] transition hover:bg-[#faf8f6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94b42]"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d94b42] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c9433a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d94b42]"
          >
            Back to home
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
