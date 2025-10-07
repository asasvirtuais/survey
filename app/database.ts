export {}

declare global {
    
    interface User {
        id: string
        name: string
    }

    interface Survey {
        id: string
        title: string
        description: string
        questions: Question['id'][]
    }

    interface Question {
        id: string
        survey: Survey['id']
        title: string
        description: string
        /** Hide this from being read by the users */
        answers: Answer['id'][]
    }

    interface Answer {
        id: string
        user: User['id']
        question: Question['id']
        text: string
    }

}