import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'

import { LearningRequestForm } from '../_components/learning-request-form'

export const dynamic = 'force-dynamic'
const Page = async ({
  params
}: {
  params: Promise<{ learningId: string }>
}) => {
  const { learningId } = await params

  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return <div>Please sign in to view this learning request.</div>
  }

  // Fetch the learning request
  const { data: request, error } = await supabase
    .from('skill_requests')
    .select('*')
    .eq('id', learningId)
    .eq('user_id', user.id)
    .single()

  if (error || !request) {
    notFound()
  }
  // Ensure availability is parsed and not null
  const parsedRequest = {
    ...request,
    availability: request.availability
      ? typeof request.availability === 'string'
        ? JSON.parse(request.availability)
        : request.availability
      : {
          weekdays: false,
          weekends: false,
          mornings: false,
          afternoons: false,
          evenings: false
        }
  }

  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Edit Learning Request
        </h2>
        <p className='text-muted-foreground'>
          Update your learning request details.
        </p>
      </div>

      <LearningRequestForm request={parsedRequest} />
    </div>
  )
}

export default Page
