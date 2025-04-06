import { parseQuery, buildQuery } from './'
import { QueryOptions } from './types'

/**
 * Merges a query string with new params, overriding existing keys.
 * @example
 * mergeQuery('?page=1', { sort: 'desc' }) → "?page=1&sort=desc"
 * mergeQuery('?tags=js', { tags: ['ts'] }) → "?tags=js,ts"
 */
export function mergeQuery(currentQuery: string, newParams: Record<string, unknown>, options?: QueryOptions): string {
  const currentParams = parseQuery(currentQuery, options)
  const mergedParams = { ...currentParams }

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      delete mergedParams[key]
      return
    }

    const existing = mergedParams[key]

    if (!Array.isArray(value) && !options?.splitArrays) {
      mergedParams[key] = value
    } else {
      const existingArray = Array.isArray(existing) ? existing : existing !== undefined ? [String(existing)] : []
      const newArray = Array.isArray(value) ? value.map(String) : [String(value)]

      mergedParams[key] = [...new Set([...existingArray, ...newArray])]
    }
  })

  Object.keys(mergedParams).forEach((key) => {
    if (mergedParams[key] === '') {
      delete mergedParams[key]
    }

    if (Array.isArray(mergedParams[key])) {
      mergedParams[key] = mergedParams[key].filter((item) => item !== '')
    }
  })

  return buildQuery(mergedParams, options)
}
