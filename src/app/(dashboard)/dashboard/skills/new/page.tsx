import { SkillForm } from '../_components/skill-form'

export const dynamic = 'force-dynamic'
const Page = () => {
  return (
    <div className='space-y-6 p-4'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight'>Add New Skill</h2>
        <p className='text-muted-foreground'>
          Share a skill you can teach to others.
        </p>
      </div>

      <SkillForm />
    </div>
  )
}

export default Page
