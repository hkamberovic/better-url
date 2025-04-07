import { buildQuery } from './buildQuery.js'

/**
 * Updates the browser URL without reloading.
 * @example updateUrl({ page: 2 }) → URL becomes "/current-path?page=2"
 */
export function updateUrl(params: Record<string, unknown>) {
  const query = buildQuery(params)
  window.history.pushState({}, '', query)
}
