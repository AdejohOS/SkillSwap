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
  Line,
  PieChart,
  Pie,
  Cell,
  Tooltip
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
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (compact) {
    return (
      <div className='h-[200px]'>
        <ChartContainer
          config={{
            hours: {
              label: 'Learning Hours',
              color: 'hsl(var(--chart-2))'
            }
          }}
          className='h-full'
        >
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={timelineData.slice(-6)}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='period' />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type='monotone'
                dataKey='hours'
                stroke='var(--color-hours)'
                name='Learning Hours'
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    )
  }
  return (
    <>
      <div>
        <h3 className='mb-2 text-lg font-medium'>Learning Requests Status</h3>
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
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='skill_name' />
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
          <h3 className='mb-2 text-lg font-medium'>Learning Timeline</h3>
          <ChartContainer
            config={{
              hours: {
                label: 'Hours',
                color: 'hsl(var(--chart-4))'
              }
            }}
            className='h-[300px]'
          >
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={timelineData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='period' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='hours'
                  stroke='var(--color-hours)'
                  name='Learning Hours'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div>
          <h3 className='mb-2 text-lg font-medium'>Learning Progress</h3>
          <div className='h-[300px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={progressData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='progress'
                  nameKey='skill_name'
                  label={({ skill_name, progress }) =>
                    `${skill_name}: ${progress}%`
                  }
                >
                  {progressData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}% complete`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}
