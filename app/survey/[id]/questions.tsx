'use client'
import React, { useState, useMemo } from 'react'
import { CreateForm, useSingle, useTable } from '@/app/data-context'
import { ButtonGroup, Heading, IconButton, Pagination, Stack, Textarea, Text } from "@chakra-ui/react"
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

export function SurveyQuestions({ user }: { user: User }) {
    const [page, setPage] = useState(1)
    // const { single: survey } = useSingle('users')
    const { array: questions } = useTable('questions')
    const { array: answers } = useTable('answers')
    const question = useMemo(() => questions[page - 1], [questions, page])
    const answer = useMemo(() => answers.find(answer => answer.questionId === question.id), [answers, question])

    return (
        <Stack>
            <Stack key={question.id}>
                <Heading>{question.title}</Heading>
                <Text>{question.description}</Text>
                <CreateForm table='answers' defaults={{question: [question.id], user: [user.id], submitted: true, text: answer?.text ?? ''}}>
                    {({fields, setField, submit}) => (
                        <Textarea defaultValue={answer?.text} disabled={!! answer} value={fields.text} onChange={e => setField('text', e.target.value)} onBlur={submit} />
                    )}
                </CreateForm>
            </Stack>

            <Pagination.Root count={questions.length} pageSize={1} defaultPage={1}
                page={page}
                onPageChange={(e) => setPage(e.page)}
            >
                <ButtonGroup variant="ghost" size="sm">
                    <Pagination.PrevTrigger asChild>
                        <IconButton>
                            <LuChevronLeft />
                        </IconButton>
                    </Pagination.PrevTrigger>
                    
                    <Pagination.Items
                        render={(page) => (
                            <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                            {page.value}
                            </IconButton>
                        )}
                    />

                    <Pagination.NextTrigger asChild>
                        <IconButton>
                            <LuChevronRight />
                        </IconButton>
                    </Pagination.NextTrigger>
                </ButtonGroup>
            </Pagination.Root>
        </Stack>
    )
}
