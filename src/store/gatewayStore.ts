import { create } from 'zustand'
import type { GatewayRegistry, GatewayUserProfile } from '@/types/gateway'

interface GatewayStoreState {
  registry: GatewayRegistry | null
  configError: string | null
  demoProfile: GatewayUserProfile | null
  setRegistry: (registry: GatewayRegistry) => void
  setConfigError: (message: string | null) => void
  setDemoProfile: (profile: GatewayUserProfile | null) => void
}

export const useGatewayStore = create<GatewayStoreState>((set) => ({
  registry: null,
  configError: null,
  demoProfile: null,
  setRegistry: (registry) => set({ registry, configError: null }),
  setConfigError: (message) => set({ configError: message }),
  setDemoProfile: (profile) => set({ demoProfile: profile }),
}))
