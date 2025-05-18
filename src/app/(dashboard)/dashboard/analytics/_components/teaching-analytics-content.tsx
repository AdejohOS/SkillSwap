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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

interface SkillData {
  skill_name: string
  requests: number
  swaps: number
}

interface CategoryData {
  category: string
  value: number
}

interface TimelineData {
  period: string
  hours: number
}

interface TeachingAnalyticsContentProps {
  skillsData: SkillData[]
  categoryData: CategoryData[]
  timelineData: TimelineData[]
  compact: boolean
}

export const TeachingAnalyticsContent = ({
  skillsData,
  categoryData,
  timelineData,
  compact
}: TeachingAnalyticsContentProps) => {
  // Colors for pie chart
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82ca9d'
  ]

  return (
    <>
      {!compact && (
        <>
          <div>
            <h3 className='mb-2 text-lg font-medium'>Skills by Popularity</h3>
            <ChartContainer
              config={{
                requests: {
                  label: 'Requests',
                  color: 'hsl(var(--chart-1))'
                },
                swaps: {
                  label: 'Completed Swaps',
                  color: 'hsl(var(--chart-2))'
                }
              }}
              className='h-[300px]'
            >
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart
                  data={skillsData}
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
                    dataKey='requests'
                    fill='var(--color-requests)'
                    name='Requests'
                  />
                  <Bar
                    dataKey='swaps'
                    fill='var(--color-swaps)'
                    name='Completed Swaps'
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className='grid gap-6 md:grid-cols-2'>
            <div>
              <h3 className='mb-2 text-lg font-medium'>Skills by Category</h3>
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx='50%'
                      cy='50%'
                      labelLine={true}
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                      nameKey='category'
                      label={({ category, percent }) =>
                        `${category}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} skills`,
                        props.payload.category
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className='mb-2 text-lg font-medium'>Teaching Activity</h3>
              <ChartContainer
                config={{
                  hours: {
                    label: 'Hours',
                    color: 'hsl(var(--chart-3))'
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
                color: 'hsl(var(--chart-3))'
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
