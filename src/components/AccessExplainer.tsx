import { LockKeyhole, Network, Waypoints } from 'lucide-react'

interface AccessExplainerProps {
  environmentDescriptor: string
}

const STEPS = (environmentDescriptor: string) => [
  {
    title: 'Authenticate',
    description:
      'Use the environment-specific Keycloak realm to establish a trusted browser session.',
    icon: LockKeyhole,
  },
  {
    title: 'Filter',
    description:
      `Match the token groups claim against the ${environmentDescriptor} platform registry and keep only authorized entries.`,
    icon: Network,
  },
  {
    title: 'Launch',
    description:
      'Redirect only to registry-approved Dagster platform hosts so the gateway never becomes an open redirect.',
    icon: Waypoints,
  },
]

export function AccessExplainer({
  environmentDescriptor,
}: AccessExplainerProps) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-400">
            Access Contract
          </p>
          <h2 className="mt-2 font-display text-3xl text-white">
            Identity in. Authorized routes out.
          </h2>
        </div>
        <div className="hidden rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cyan-100 md:block">
          {environmentDescriptor} gateway rollout
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {STEPS(environmentDescriptor).map(({ description, icon: Icon, title }) => (
          <article
            key={title}
            className="rounded-3xl border border-white/8 bg-slate-950/55 p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-100">
              <Icon className="h-4 w-4" />
            </div>
            <h3 className="mt-4 font-medium text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
