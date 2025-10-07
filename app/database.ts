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
    surveyId: z.string(),
    title: z.string(),
    description: z.string(),
    /** Hide this from being read by the users */
    answers: z.array(z.string()),
})

export const AnswerSchema = z.object({
    id: z.string(),
    user: z.string().array(),
    userId: z.string(),
    question: z.string().array(),
    questionId: z.string(),
    survey: z.string().array(),
    surveyId: z.string(),
    text: z.string(),
    submitted: z.boolean(),
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
    surveys: {
        readable: SurveySchema,
        writable: SurveySchema,
    },
    questions: {
        readable: QuestionSchema,
        writable: QuestionSchema,
    },
    answers: {
        readable: AnswerSchema,
        writable: AnswerSchema.omit({id: true, survey: true, surveyId: true, questionId: true, userId: true}),
    }
}
