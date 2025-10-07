'use client'
import { reactInterface } from 'asasvirtuais/react-interface'
import { fetchInterface } from 'asasvirtuais/fetch-interface'
import { schema } from './database'

export const {
    DatabaseProvider,
    TableProvider,
    useTable,
    SingleProvider,
    useSingle,
    CreateForm,
    FilterForm,
} = reactInterface(schema, fetchInterface({schema}))
