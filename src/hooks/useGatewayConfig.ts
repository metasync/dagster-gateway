import { useEffect, useMemo, useState } from 'react'
import type { GatewayAuthMode, GatewayRegistry } from '@/types/gateway'
import { useGatewayStore } from '@/store/gatewayStore'
import { parseGatewayRegistry } from '@/utils/gateway'

const DEFAULT_LOCAL_REGISTRY_URL = '/config/snd.registry.local.json'
const DEFAULT_SND_PUBLIC_REGISTRY_URL = '/config/snd.registry.public.json'
const DEFAULT_PRD_PUBLIC_REGISTRY_URL = '/config/prd.registry.public.json'

function getDefaultRegistryUrl() {
  const hostname = window.location.hostname.toLowerCase()

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return DEFAULT_LOCAL_REGISTRY_URL
  }

  if (hostname.startsWith('snd-')) {
    return DEFAULT_SND_PUBLIC_REGISTRY_URL
  }

  return DEFAULT_PRD_PUBLIC_REGISTRY_URL
}

export function useGatewayConfig() {
  const [isLoading, setIsLoading] = useState(true)
  const { configError, registry, setConfigError, setRegistry } = useGatewayStore()

  useEffect(() => {
    let isMounted = true

    async function loadRegistry() {
      try {
        setIsLoading(true)
        const response = await fetch(
          import.meta.env.VITE_GATEWAY_REGISTRY_URL ?? getDefaultRegistryUrl(),
        )

        if (!response.ok) {
          throw new Error(`Unable to load gateway registry: ${response.status}`)
        }

        const payload = await response.json()
        const parsed = parseGatewayRegistry(payload)

        if (isMounted) {
          setRegistry(parsed)
        }
      } catch (error) {
        if (isMounted) {
          setConfigError(
            error instanceof Error ? error.message : 'Failed to load gateway configuration.',
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadRegistry()

    return () => {
      isMounted = false
    }
  }, [setConfigError, setRegistry])

  const authMode = useMemo<GatewayAuthMode>(() => {
    const mode = import.meta.env.VITE_GATEWAY_AUTH_MODE

    if (mode === 'oidc' || mode === 'demo') {
      return mode
    }

    return registry?.authMode ?? 'demo'
  }, [registry])

  return {
    authMode,
    configError,
    isLoading,
    registry: registry as GatewayRegistry | null,
  }
}
