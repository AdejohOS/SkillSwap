'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

interface ActivityData {
  period: string
  logins: number
  messages: number
  swaps: number
}

interface ResponseData {
  period: string
  hours: number
}

interface RatingData {
  rating: number
  count: number
}

interface EngagementAnalyticsContentProps {
  activityData: ActivityData[]
  responseData: ResponseData[]
  ratingData: RatingData[]
  compact: boolean
}

export const EngagementAnalyticsContent = ({
  activityData,
  responseData,
  ratingData,
  compact
}: EngagementAnalyticsContentProps) => {
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <>
      {!compact && (
        <>
          <div>
            <h3 className='mb-2 text-lg font-medium'>Platform Activity</h3>
            <ChartContainer
              config={{
                logins: {
                  label: 'Logins',
                  color: 'hsl(var(--chart-1))'
                },
                messages: {
                  label: 'Messages',
                  color: 'hsl(var(--chart-2))'
                },
                swaps: {
                  label: 'Swaps',
                  color: 'hsl(var(--chart-3))'
                }
              }}
              className='h-[300px]'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart
                  data={activityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='period' />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='logins'
                    stroke='var(--color-logins)'
                    name='Logins'
                  />
                  <Line
                    type='monotone'
                    dataKey='messages'
                    stroke='var(--color-messages)'
                    name='Messages'
                  />
                  <Line
                    type='monotone'
                    dataKey='swaps'
                    stroke='var(--color-swaps)'
                    name='Swaps'
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 text-lg font-medium'>Response Time</h3>
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
                  <BarChart
                    data={responseData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='period' />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey='hours'
                      fill='var(--color-hours)'
                      name='Avg. Response Time (hours)'
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Ratings Distribution</h3>
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={ratingData}
                      cx='50%'
                      cy='50%'
                      labelLine={true}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='count'
                      nameKey='rating'
                      label={({ rating, percent }) =>
                        `${rating} stars: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {ratingData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} ratings`,
                        `${props.payload.rating} stars`
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {compact && (
        <div className='h-[200px]'>
          <ChartContainer
            config={{
              logins: {
                label: 'Logins',
                color: 'hsl(var(--chart-1))'
              },
              messages: {
                label: 'Messages',
                color: 'hsl(var(--chart-2))'
              }
            }}
            className='h-full'
          >
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart
                data={activityData.slice(-5)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='period' />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='logins'
                  stroke='var(--color-logins)'
                  name='Logins'
                />
                <Line
                  type='monotone'
                  dataKey='messages'
                  stroke='var(--color-messages)'
                  name='Messages'
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
    </>
  )
}
