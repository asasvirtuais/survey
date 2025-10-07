import { z } from 'zod'
import { base } from './airtable'
import { ListProps } from 'asasvirtuais/interface'

export const UserSchema = z.object({
    id: z.string(),
    name: z.string(),
})

export const SurveySchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    questions: z.array(z.string()),
})

export const QuestionSchema = z.object({
    id: z.string(),
    survey: z.string(),
    title: z.string(),
    description: z.string(),
    /** Hide this from being read by the users */
    answers: z.array(z.string()),
})

export const AnswerSchema = z.object({
    id: z.string(),
    user: z.string(),
    question: z.string(),
    text: z.string(),
})

declare global {
    type User = z.infer<typeof UserSchema>
    type Survey = z.infer<typeof SurveySchema>
    type Question = z.infer<typeof QuestionSchema>
    type Answer = z.infer<typeof AnswerSchema>
}

const schema = {
    users: {
        readable: UserSchema,
        writable: UserSchema.omit({id: true}),
    },
    survey: {
        readable: SurveySchema,
        writable: SurveySchema,
    },
    questions: {
        readable: QuestionSchema,
        writable: QuestionSchema,
    },
    answers: {
        readable: AnswerSchema,
        writable: AnswerSchema.omit({id: true}),
    }
}

/** database.ts exports unsafe */
export const unsafe = base.interface()

export async function authenticate(): Promise<User> {
    throw new Error('Not Implemented')
}

/** All middleware for CRUD operations goes here */
export const safe = {
    async find(props) {

        const user = await authenticate()

        /** Only the user can read his own data */
        if (props.table === 'users')
            if (props.id !== user.id)
                throw new Error('Unauthorized')

        const result = await unsafe.find(props)

        /** Only the user can read his own data */
        if (props.table === 'answers')
            if ((result as Answer).user !== user.id)
                throw new Error('Unauthorized')

        return result
    },
    async list(props) {
        const user = await authenticate()

        /** Users are not listed */
        if (props.table === 'users')
            throw new Error('Unauthorized')
        /** Answers must belong to the user */
        if (props.table === 'answers')
            (props as ListProps<Answer>).query = { user: user.id }

        return unsafe.list(props)
    },
    async create(props) {
        const user = await authenticate()

        /** Only answers are created in the app */
        if (props.table !== 'answers') {
            throw new Error('Unauthorized')
        }

        /** Ensure the created answer belongs to the authenticated user */
        (props.data as Partial<Answer>).user = user.id

        /** Parse the user input */
        props.data = schema.answers.writable.parse(props.data)

        return unsafe.create(props)
    },
    async update(props) {
        throw new Error('Invalid method')
        const user = await authenticate()
        return unsafe.update(props)
    },
    async remove(props) {
        throw new Error('Invalid method')
        const user = await authenticate()
        return unsafe.remove(props)
    },
} as typeof unsafe

export default schema
