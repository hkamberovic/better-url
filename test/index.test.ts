import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { buildQuery, mergeQuery, parseQuery, updateUrl } from '../src'

describe('parseQuery', () => {
  it('parses empty string', () => {
    expect(parseQuery('')).toEqual({})
  })

  it('parses simple key-value pairs', () => {
    expect(parseQuery('?name=Alice&age=25')).toEqual({
      name: 'Alice',
      age: 25,
    })
  })

  it('handles special characters (decodes automatically)', () => {
    expect(parseQuery('?query=a%26b%3Dc&space=a+b')).toEqual({
      query: 'a&b=c',
      space: 'a b',
    })
  })

  it('parses comma-separated values as string by default', () => {
    expect(parseQuery('?tags=js,ts')).toEqual({
      tags: 'js,ts',
    })
  })

  it('splits into arrays when splitArrays=true', () => {
    expect(parseQuery('?tags=js,ts&colors=red,blue', { splitArrays: true })).toEqual({
      tags: ['js', 'ts'],
      colors: ['red', 'blue'],
    })
  })

  it('parses boolean-like strings', () => {
    expect(parseQuery('?active=true&disabled=false')).toEqual({
      active: true,
      disabled: false,
    })
  })

  it('handles empty values', () => {
    expect(parseQuery('?empty=&null=null')).toEqual({
      empty: '',
      null: 'null',
    })
  })
})

describe('buildQuery', () => {
  it('builds empty object', () => {
    expect(buildQuery({})).toBe('')
  })

  it('handles arrays with unencoded commas', () => {
    expect(buildQuery({ tags: ['js', 'ts'] })).toBe('?tags=js,ts')
    expect(buildQuery({ filters: ['price>100', 'rating<3'] })).toBe('?filters=price>100,rating<3')
  })

  it('can encode special characters when requested', () => {
    expect(buildQuery({ q: 'a&b=c' }, { encode: true })).toBe('?q=a%26b%3Dc')
  })

  it('skips undefined/null values', () => {
    expect(buildQuery({ a: 1, b: undefined, c: null, d: 0 })).toBe('?a=1&d=0')
  })

  it('handles boolean and number values', () => {
    expect(buildQuery({ active: true, count: 5 })).toBe('?active=true&count=5')
  })
})

describe('mergeQuery', () => {
  it('merges new params', () => {
    expect(mergeQuery('?page=1', { sort: 'desc' })).toBe('?page=1&sort=desc')
  })

  it('overrides existing params', () => {
    expect(mergeQuery('?page=1&sort=asc', { page: 2, sort: 'desc' })).toBe('?page=2&sort=desc')
  })

  it('combines arrays from strings and arrays', () => {
    expect(mergeQuery('?tags=js', { tags: ['ts'] })).toBe('?tags=js,ts')
    expect(mergeQuery('?tags=js,react', { tags: 'ts' }, { splitArrays: true })).toBe('?tags=js,react,ts')
  })

  it('deduplicates array values', () => {
    expect(mergeQuery('?tags=js,react', { tags: ['react', 'ts'] }, { splitArrays: true })).toBe('?tags=js,react,ts')
  })

  it('handles empty states', () => {
    expect(mergeQuery('', { page: 1 })).toBe('?page=1')
    expect(mergeQuery('?tags=', { tags: ['ts'] })).toBe('?tags=ts')
  })

  it('handles mixed value types', () => {
    expect(mergeQuery('?val=string', { val: ['array'] })).toBe('?val=string,array')
    expect(mergeQuery('?val=1', { val: 2 })).toBe('?val=2')
  })
})

describe('Browser Environment', () => {
  beforeEach(() => {
    // Reset mocks before each test
    window.location.search = ''
    vi.restoreAllMocks()
  })

  describe('window.location', () => {
    it('reads current query', () => {
      window.location.search = '?page=1&test=true'
      expect(parseQuery(window.location.search)).toEqual({
        page: 1,
        test: true,
      })
    })
  })

  describe('updateUrl', () => {
    it('updates the URL using History API', () => {
      const pushStateSpy = vi.spyOn(window.history, 'pushState')
      updateUrl({ page: 2, sort: 'desc' })

      expect(pushStateSpy).toHaveBeenCalledWith({}, '', '?page=2&sort=desc')
      expect(window.location.search).toBe('?page=2&sort=desc')
    })

    it('handles empty params', () => {
      updateUrl({})
      expect(window.location.search).toBe('')
    })
  })
})
