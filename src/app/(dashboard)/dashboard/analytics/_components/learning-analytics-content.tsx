'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

interface RequestsData {
  skill_name: string
  pending: number
  accepted: number
  completed: number
}

interface ProgressData {
  skill_name: string
  progress: number
}

interface TimelineData {
  period: string
  hours: number
}

interface LearningAnalyticsContentProps {
  requestsData: RequestsData[]
  progressData: ProgressData[]
  timelineData: TimelineData[]
  compact: boolean
}

export const LearningAnalyticsContent = ({
  requestsData,
  progressData,
  timelineData,
  compact
}: LearningAnalyticsContentProps) => {
  return (
    <>
      {!compact && (
        <>
          <div>
            <h3 className='mb-2 text-lg font-medium'>
              Learning Requests Status
            </h3>
            <ChartContainer
              config={{
                pending: {
                  label: 'Pending',
                  color: 'hsl(var(--chart-1))'
                },
                accepted: {
                  label: 'Accepted',
                  color: 'hsl(var(--chart-2))'
                },
                completed: {
                  label: 'Completed',
                  color: 'hsl(var(--chart-3))'
                }
              }}
              className='h-[300px]'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={requestsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='skill_name'
                    angle={-45}
                    textAnchor='end'
                    height={70}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar
                    dataKey='pending'
                    fill='var(--color-pending)'
                    name='Pending'
                  />
                  <Bar
                    dataKey='accepted'
                    fill='var(--color-accepted)'
                    name='Accepted'
                  />
                  <Bar
                    dataKey='completed'
                    fill='var(--color-completed)'
                    name='Completed'
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 text-lg font-medium'>Learning Progress</h3>
              <ChartContainer
                config={{
                  progress: {
                    label: 'Progress',
                    color: 'hsl(var(--chart-4))'
                  }
                }}
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='skill_name' />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type='monotone'
                      dataKey='progress'
                      stroke='var(--color-progress)'
                      name='Progress %'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Learning Hours</h3>
              <ChartContainer
                config={{
                  hours: {
                    label: 'Hours',
                    color: 'hsl(var(--chart-5))'
                  }
                }}
                className='h-[300px]'
              >
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={timelineData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='period' />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey='hours'
                      fill='var(--color-hours)'
                      name='Hours'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </>
      )}

      {compact && (
        <div className='h-[200px]'>
          <ChartContainer
            config={{
              hours: {
                label: 'Hours',
                color: 'hsl(var(--chart-5))'
              }
            }}
            className='h-full'
          >
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={timelineData.slice(-5)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='period' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey='hours' fill='var(--color-hours)' name='Hours' />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </>
  )
}
