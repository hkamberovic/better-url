import { QueryOptions } from './types'

/**
 * Parses a query string into an object with type inference.
 * @example parseQuery<{ page: number }>("?page=1") → { page: 1 }
 */
export function parseQuery<T = Record<string, unknown>>(query: string, options?: QueryOptions): Partial<T> {
  const params = new URLSearchParams(query)
  const result: Record<string, unknown> = {}

  params.forEach((value, key) => {
    const decodedValue = decodeURIComponent(value)
    const decodedKey = decodeURIComponent(key)

    if (decodedValue === '') {
      result[decodedKey] = ''
      return
    }

    if (options?.splitArrays && decodedValue.includes(',')) {
      result[decodedKey] = decodedValue.split(',').map((v) => v.trim())
    } else if (!isNaN(Number(decodedValue))) {
      result[decodedKey] = Number(decodedValue)
    } else if (decodedValue === 'true' || decodedValue === 'false') {
      result[decodedKey] = decodedValue === 'true'
    } else {
      result[decodedKey] = decodedValue
    }
  })

  return result as Partial<T>
}
