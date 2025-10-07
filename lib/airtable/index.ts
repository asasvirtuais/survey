import wretch from 'wretch'
import QueryStringAddon from 'wretch/addons/queryString'

import { ratePerSec } from 'asasvirtuais/wretch'

// Usage and explanation: this file maps urls to wretch endpoints
// https://api.airtable.com/v0/meta/bases/{baseId}/tables
// wairtable(token).base(baseId).table(tableId).record(recordId).get().json()
// https://api.airtable.com/v0/meta/bases/{baseId}/tables
// wairtable(token).meta().bases().base(baseId).tables().get().json()
// wairtable(token).meta().bases().base(baseId).tables().table(tableId).fields().json(newField).post().json() // Object.assign allows accessing further endpoints with ease.
export function wairtable(token: string) {
  const api = wretch('https://api.airtable.com/v0')
    .middlewares([ratePerSec(5)])
    .addon(QueryStringAddon)
    .auth(`Bearer ${token}`)

  return Object.assign(api, {
    meta: () => {
      const meta = api.url(`/meta`)

      return Object.assign(meta, {
        bases: () => {
          const bases = api.url(`/meta/bases`)

          return Object.assign(bases, {
            base: (baseId: string) => {
              const base = bases.url(`/${baseId}`)

              return Object.assign(base, {
                tables: () => {
                  const tables = base.url(`/tables`)

                  return Object.assign(tables, {
                    table: (tableId: string) => {
                      const table = tables.url(`/${tableId}`)

                      return Object.assign(table, {
                        fields: () => table.url(`/fields`),
                        field: (fieldId: string) => table.url(`/${fieldId}`),
                      })
                    },
                  })
                },
              })
            },
          })
        },
      })
    },
    base: (baseId: string) => {
      const base = api.url(`/${baseId}`)

      return Object.assign(base, {
        table: (tableId: string) => {
          const table = base.url(`/${encodeURIComponent(tableId)}`)

          const record = (id: string) => table.url(`/${id}`)

          // Add endpoints for records collection and single record
          const records = () => table.url(`/records`)

          return Object.assign(table, {
            // List records: GET /records
            records,
            // Retrieve, update, delete a single record: /records/{id}
            record,
            fields: () => table.url(`/fields`),
          })
        },
      })
    },
  })
}

import type {
  DatabaseInterface,
  Query,
  TableInterface,
} from 'asasvirtuais/interface'
import z from 'zod'
import env from 'asasvirtuais/env'
import { Airtable } from './types'

// Convert Query to Airtable query format
export function convertQuery<T>(query?: Query<T>): Record<string, any> {
  if (!query) return {}

  const airtableQuery: Record<string, any> = {}

  // Handle filters
  if (query.$limit) airtableQuery.maxRecords = query.$limit
  if (query.$skip) airtableQuery.offset = query.$skip
  if (query.$sort) {
    const sortEntries = Object.entries(query.$sort)
    if (sortEntries.length > 0) {
      airtableQuery.sort = sortEntries.map(([field, direction]) => ({
        field,
        direction: direction === 1 ? 'asc' : 'desc'
      }))
    }
  }
  if (query.$select) {
    airtableQuery.fields = query.$select
  }

  // Handle field filters - convert to Airtable formula format
  const fieldFilters: string[] = []
  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('$')) return // Skip special operators

    if (typeof value === 'object' && value !== null) {
      // Handle operators
      if ('$ne' in value) fieldFilters.push(`{${key}} != '${value.$ne}'`)
      if ('$in' in value && Array.isArray(value.$in)) {
        fieldFilters.push(`OR(${value.$in.map(v => `{${key}} = '${v}'`).join(', ')})`)
      }
      if ('$nin' in value && Array.isArray(value.$nin)) {
        fieldFilters.push(`NOT(OR(${value.$nin.map(v => `{${key}} = '${v}'`).join(', ')}))`)
      }
      if ('$lt' in value) fieldFilters.push(`{${key}} < ${value.$lt}`)
      if ('$lte' in value) fieldFilters.push(`{${key}} <= ${value.$lte}`)
      if ('$gt' in value) fieldFilters.push(`{${key}} > ${value.$gt}`)
      if ('$gte' in value) fieldFilters.push(`{${key}} >= ${value.$gte}`)
    } else {
      // Direct equality
      fieldFilters.push(`{${key}} = '${value}'`)
    }
  })

  // Handle $or and $and
  const queryAny = query as any
  if (queryAny.$or) {
    const orFilters = queryAny.$or.map((subQuery: Query<T>) => convertQuery(subQuery).filterByFormula).filter(Boolean)
    if (orFilters.length > 0) {
      fieldFilters.push(`OR(${orFilters.join(', ')})`)
    }
  }

  if (queryAny.$and) {
    const andFilters = queryAny.$and.map((subQuery: Query<T>) => convertQuery(subQuery).filterByFormula).filter(Boolean)
    if (andFilters.length > 0) {
      fieldFilters.push(`AND(${andFilters.join(', ')})`)
    }
  }

  if (fieldFilters.length > 0) {
    airtableQuery.filterByFormula = fieldFilters.length === 1 ? fieldFilters[0] : `AND(${fieldFilters.join(', ')})`
  }

  return airtableQuery
}

export default function airtable(apiKey?: string) {
  if (!apiKey)
    apiKey = env('AIRTABLE_TOKEN')

  const api = wairtable(apiKey)

  return {
    api,
    base<Schema extends {[Table in string]: unknown}>(baseId: string) {
      return {
        interface<Table extends keyof Schema = keyof Schema>(defaultTable?: Table & string): TableInterface<Schema[Table], z.infer<Schema[Table]>> {
          type Readable = Schema[Table]
          type Writable = Schema[Table]
          const mapRecordToObject = (record: { id: string, fields: Airtable.RecordFieldsreadable }) => ({ id: record.id, ...record.fields }) as Readable
          return {
            async list({ table = defaultTable, query }) {
              return api.base(baseId).table(table as string).query(convertQuery(query) ?? {}).get().json<{ records: Array<{ id: string, fields: Airtable.RecordFieldsreadable }> }>().then(({ records }) => records.map(mapRecordToObject))
            },
            async find({ table = defaultTable, id }) {
              return api.base(baseId).table(table as string).record(id).get().json<{ id: string, fields: Airtable.RecordFieldsreadable }>().then(mapRecordToObject)
            },
            async create({ table = defaultTable, data }) {
              return api.base(baseId).table(table as string).post({ fields: data }).json<{ id: string, fields: Airtable.RecordFieldsreadable }>().then(mapRecordToObject)
            },
            async update({ table = defaultTable, id, data }) {
              return api.base(baseId).table(table as string).record(id).patch({ fields: data }).json<{ id: string, fields: Airtable.RecordFieldsreadable }>().then(mapRecordToObject)
            },
            async remove({ table = defaultTable, id }) {
              return api.base(baseId).table(table as string).record(id).delete().json<Readable>()
            }
          }
        }
      }
    }
  }
}