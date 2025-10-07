import { Button, Card, Container, Heading, Stack } from '@chakra-ui/react'
import Link from 'next/link'
import { tables } from './server'

export default async function Home() {
  const surveys = await tables.surveys.list({})

  return (
    <Container maxW='breakpoint-sm'>
      <Stack py={4} gap={4}>
        <Heading>Survey App</Heading>
        {surveys.map(survey => (
          <Card.Root>
            <Card.Body>
              <Card.Title>{survey.title}</Card.Title>
              <Card.Description>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Optio excepturi fugiat repellendus ipsam, aspernatur libero nisi pariatur, eligendi iure, saepe maxime asperiores aperiam. Quis facilis voluptatum, cupiditate et incidunt sapiente.
              </Card.Description>
            </Card.Body>
            <Card.Footer justifyContent='flex-end'>
              <Button variant='outline' asChild>
                <Link href='#'>View</Link>
              </Button>
            </Card.Footer>
          </Card.Root>
        ))}
      </Stack>
    </Container>
  )
}
