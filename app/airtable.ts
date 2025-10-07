import initAirtable from '@/lib/airtable'

const apiKey = process.env.AIRTABLE_API_TOKEN

if (! apiKey)
    throw new Error('No AIRTABLE_API_TOKEN found')

const airtable = initAirtable(apiKey)

const base = airtable.base<{
    Users: User,
    Surveys: Survey,
    Questions: Question,
    Answers: Answer,
}>('appQsHUFPsY0GwJ1q')

export const tables = {
    users: base.interface('Users'),
    surveys: base.interface('Surveys'),
    questions: base.interface('Questions'),
    answers: base.interface('Answers'),
}

export default airtable