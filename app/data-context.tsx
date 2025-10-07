import { reactInterface } from 'asasvirtuais/react-interface'
import { fetchInterface } from 'asasvirtuais/fetch-interface'
import { schema } from './database'

export const {
    useTable,
    useSingle,
    DatabaseProvider,
    TableProvider,
    CreateForm,
    FilterForm,
} = reactInterface(schema, fetchInterface({schema}))
