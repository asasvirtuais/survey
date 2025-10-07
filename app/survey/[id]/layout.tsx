import { layout } from 'asasvirtuais/next'
import { DatabaseProvider, SingleProvider } from '@/app/data-context'
import { authenticate, tables } from '@/app/server'

export default layout<{id: string}>(
    async function SurveyLayout({ id, children }) {
        const user = await authenticate()
        const survey = await tables.surveys.find({id})
        const questions = await tables.questions.list({query: { surveyId: id }})
        const questionsIndex = Object.fromEntries(questions.map(question => [question.id, question]))
        const answers = await tables.answers.list({query: {userId: user.id, surveyId: survey.id }})
        const answersIndex = Object.fromEntries(answers.map(answer => [answer.id, answer]))
        console.log(answersIndex)
        return (
            <DatabaseProvider
                users={{[user.id]: user}}
                surveys={{[survey.id]: survey}}
                questions={questionsIndex}
                answers={answersIndex}
            >
                <SingleProvider table='users' id={user.id}>
                    {children}
                </SingleProvider>
            </DatabaseProvider>
        )
    }
)