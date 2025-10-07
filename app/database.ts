import { z } from 'zod'

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

export const schema = {
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
