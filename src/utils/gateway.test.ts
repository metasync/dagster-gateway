import { describe, expect, it } from 'vitest'
import {
  filterAuthorizedPlatforms,
  isAllowedPlatformUrl,
  parseGatewayRegistry,
  resolveMatchedGroups,
} from '@/utils/gateway'

const registry = parseGatewayRegistry({
  environment: 'snd',
  displayName: 'Sandbox Dagster Gateway',
  issuer: 'https://idp.apps.metasync.cc/realms/snd',
  clientId: 'snd-dagster-gateway',
  postLogoutRedirectUri: 'http://localhost:5173/',
  platforms: [
    {
      id: 'pilot',
      name: 'Pilot',
      team: 'pilot',
      environment: 'snd',
      url: 'https://snd-pilot.apps.metasync.cc',
      requiredGroups: ['dagster-access'],
    },
    {
      id: 'dwt',
      name: 'DWT',
      team: 'dwt',
      environment: 'snd',
      url: 'https://snd-dwt.apps.metasync.cc',
      requiredGroups: ['dagster-team-dwt'],
    },
  ],
})

describe('gateway registry helpers', () => {
  it('filters platforms by matching groups', () => {
    expect(
      filterAuthorizedPlatforms(registry.platforms, ['dagster-access']).map(
        (platform) => platform.id,
      ),
    ).toEqual(['pilot'])
  })

  it('supports multiple matched groups for a platform', () => {
    expect(
      resolveMatchedGroups(
        {
          ...registry.platforms[1],
          requiredGroups: ['dagster-team-dwt', 'dagster-access'],
        },
        ['dagster-team-dwt', 'dagster-access'],
      ),
    ).toEqual(['dagster-team-dwt', 'dagster-access'])
  })

  it('blocks non-allowlisted redirect destinations', () => {
    expect(
      isAllowedPlatformUrl('https://snd-pilot.apps.metasync.cc', registry.platforms),
    ).toBe(true)
    expect(
      isAllowedPlatformUrl('https://evil.example.invalid', registry.platforms),
    ).toBe(false)
  })

  it('rejects platform entries that do not match the registry environment', () => {
    expect(() =>
      parseGatewayRegistry({
        ...registry,
        platforms: [
          {
            ...registry.platforms[0],
            environment: 'prd',
          },
        ],
      }),
    ).toThrow(/Platform environment must match registry environment/)
  })
})
