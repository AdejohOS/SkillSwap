import { DottedSeparator } from '@/components/ui/dotted-separator'
import Link from 'next/link'

export const Sidebar = () => {
  return (
    <aside className='h-full w-full bg-neutral-100 p-4'>
      <Link href='/' className='text-2xl font-bold'>
        SkillSwap
      </Link>
      <DottedSeparator className='my-4' />
    </aside>
  )
}
