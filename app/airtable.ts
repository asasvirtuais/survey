import initAirtable from 'asasvirtuais/airtable'
import { schema } from './database'

const apiKey = process.env.AIRTABLE_API_TOKEN

if (! apiKey)
    throw new Error('No AIRTABLE_API_TOKEN found')

const airtable = initAirtable(apiKey)

export const base = airtable.base('appQsHUFPsY0GwJ1q', schema)

export default airtable