import { QueryOptions } from './types'

/**
 * Converts an object to a URL query string.
 * @example buildQuery({ tags: ['js', 'ts'] }) → "?tags=js,ts"
 */
export function buildQuery(obj: Record<string, unknown>, options?: QueryOptions): string {
  const validEntries = Object.entries(obj).filter(([_, value]) => value !== undefined && value !== null)

  if (validEntries.length === 0) {
    return ''
  }

  const queryParts = validEntries.map(([key, value]) => {
    let stringValue: string

    if (Array.isArray(value)) {
      const stringValues = value.map((item) => String(item))
      stringValue = stringValues.join(',')
    } else {
      stringValue = String(value)
    }

    if (options?.encode) {
      stringValue = encodeURIComponent(stringValue)
    }

    return `${key}=${stringValue}`
  })

  return '?' + queryParts.join('&')
}
