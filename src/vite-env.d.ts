/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GATEWAY_AUTH_MODE?: 'demo' | 'oidc'
  readonly VITE_GATEWAY_REGISTRY_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
