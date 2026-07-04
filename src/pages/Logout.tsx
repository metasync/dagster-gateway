import { useEffect } from 'react'

interface LogoutProps {
  onLogout: () => void
}

export function Logout({ onLogout }: LogoutProps) {
  useEffect(() => {
    onLogout()
  }, [onLogout])

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <section className="w-full rounded-[32px] border border-white/10 bg-slate-950/78 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Logout
        </p>
        <h1 className="mt-3 font-display text-4xl text-white">
          Closing the current session.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          Your browser session is being cleared and the gateway will return to the
          landing view.
        </p>
      </section>
    </main>
  )
}
