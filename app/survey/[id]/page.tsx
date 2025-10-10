'use client'

import { CreateForm, SingleProvider, useSingle, useTable } from '@/app/data-context'
import { Heading, Stack, Text, Textarea } from '@chakra-ui/react'
import { useParams } from 'next/navigation'
import { SurveyQuestions } from './questions'

export default function Survey() {
    const { id } = useParams()
    const { single: user } = useSingle('users')
    const { array: questions } = useTable('questions')

    return (
        <SingleProvider table='surveys' id={id as string}>
            {({single: survey}) => (
                <Stack maxW='breakpoint-sm' py={4} gap={4} mx='auto' minH='100lvh' justify='center'>
                    <Heading>{survey.title}</Heading>
                    <Text>{survey.description}</Text>
                    <SurveyQuestions user={user}/>
                </Stack>
            )}
        </SingleProvider>
    )
}