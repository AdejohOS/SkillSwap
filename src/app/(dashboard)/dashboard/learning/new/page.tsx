import { LearningRequestForm } from '../_components/learning-request-form'

const Page = () => {
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>
          Add Learning Request
        </h2>
        <p className='text-muted-foreground'>
          Specify a skill you want to learn from others.
        </p>
      </div>

      <LearningRequestForm />
    </div>
  )
}

export default Page
