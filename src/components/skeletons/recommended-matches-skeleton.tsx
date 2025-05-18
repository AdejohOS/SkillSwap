import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const RecommendedMatchesSkeleton = () => {
  return (
    <Card className='col-span-3'>
      <CardHeader>
        <CardTitle>Recommended Matches</CardTitle>
        <CardDescription>Users with complementary skills</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex items-center space-x-4'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div className='flex-1 space-y-2'>
              <div className='flex items-center'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='ml-2 h-4 w-16' />
              </div>
              <Skeleton className='h-3 w-full' />
            </div>
            <Skeleton className='h-8 w-16' />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Skeleton className='h-10 w-full' />
      </CardFooter>
    </Card>
  )
}
