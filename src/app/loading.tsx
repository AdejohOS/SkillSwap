import { Loader } from 'lucide-react'

const Loading = () => {
  return (
    <div className='flex min-h-full items-center justify-center'>
      <Loader className='text-muted-foreground size-6 animate-spin' />
    </div>
  )
}

export default Loading
