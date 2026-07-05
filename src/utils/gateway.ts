import { z } from 'zod'
import type {
  DemoUserProfile,
  GatewayPlatform,
  GatewayRegistry,
  GatewayUserProfile,
} from '@/types/gateway'

const platformSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  team: z.string().min(1),
  environment: z.enum(['snd', 'prd']),
  url: z.string().url(),
  requiredGroups: z.array(z.string().min(1)).min(1),
  description: z.string().optional(),
})

const demoUserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  groups: z.array(z.string().min(1)).default([]),
})

const registrySchema = z.object({
  environment: z.enum(['snd', 'prd']),
  displayName: z.string().min(1),
  issuer: z.string().url(),
  clientId: z.string().min(1),
  authMode: z.enum(['demo', 'oidc']).optional(),
  postLogoutRedirectUri: z.string().url(),
  platforms: z.array(platformSchema),
  demoUsers: z.array(demoUserSchema).optional(),
}).superRefine((registry, ctx) => {
  registry.platforms.forEach((platform, index) => {
    if (platform.environment !== registry.environment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Platform environment must match registry environment (${registry.environment}).`,
        path: ['platforms', index, 'environment'],
      })
    }
  })
})

export function parseGatewayRegistry(input: unknown): GatewayRegistry {
  return registrySchema.parse(input) as GatewayRegistry
}

export function normalizeGroups(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((group): group is string => typeof group === 'string')
}

export function filterAuthorizedPlatforms(
  platforms: GatewayPlatform[],
  groups: string[],
): GatewayPlatform[] {
  if (groups.length === 0) {
    return []
  }

  return platforms.filter((platform) =>
    platform.requiredGroups.some((group) => groups.includes(group)),
  )
}

export function resolveMatchedGroups(
  platform: GatewayPlatform,
  groups: string[],
): string[] {
  return platform.requiredGroups.filter((group) => groups.includes(group))
}

export function toGatewayUserProfile(
  user: DemoUserProfile | GatewayUserProfile,
): GatewayUserProfile {
  if ('username' in user) {
    return {
      sub: user.id,
      preferred_username: user.username,
      email: user.email,
      name: user.name,
      groups: user.groups,
    }
  }

  return {
    sub: user.sub,
    preferred_username: user.preferred_username,
    email: user.email,
    name: user.name,
    groups: normalizeGroups(user.groups),
  }
}

export function createAllowedUrlMap(
  platforms: GatewayPlatform[],
): Map<string, GatewayPlatform> {
  return new Map(platforms.map((platform) => [platform.url, platform]))
}

export function isAllowedPlatformUrl(
  targetUrl: string,
  platforms: GatewayPlatform[],
): boolean {
  return createAllowedUrlMap(platforms).has(targetUrl)
}
