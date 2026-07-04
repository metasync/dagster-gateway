import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'react-oidc-context'

export function OidcCallback() {
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [auth.isAuthenticated, navigate])

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
      <section className="w-full rounded-[32px] border border-white/10 bg-slate-950/78 p-8 text-center shadow-2xl shadow-slate-950/40">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
          Callback
        </p>
        <h1 className="mt-3 font-display text-4xl text-white">
          Completing sign-in.
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-300">
          The gateway is finalizing the OIDC code exchange and will return you to
          the platform list automatically.
        </p>
        {auth.error ? (
          <p className="mt-4 text-sm text-rose-300">{auth.error.message}</p>
        ) : null}
      </section>
    </main>
  )
}
