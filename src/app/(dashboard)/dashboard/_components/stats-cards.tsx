import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StatsCards() {
  // In a real app, you would fetch this data from your API
  const stats = {
    totalSkillsOffered: 156,
    totalSkillsRequested: 89,
    activeUsers: 42,
    completedSwaps: 78
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Skills Offered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalSkillsOffered}</div>
          <p className='text-muted-foreground text-xs'>
            Skills available for learning
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Total Skills Requested
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.totalSkillsRequested}</div>
          <p className='text-muted-foreground text-xs'>
            Skills people want to learn
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.activeUsers}</div>
          <p className='text-muted-foreground text-xs'>
            Users online this week
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>Completed Swaps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>{stats.completedSwaps}</div>
          <p className='text-muted-foreground text-xs'>
            Successful skill exchanges
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
