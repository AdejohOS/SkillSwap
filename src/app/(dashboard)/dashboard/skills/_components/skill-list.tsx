'use client'

import { useState } from 'react'
import Link from 'next/link'

import { useRouter } from 'next/navigation'
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeftRight
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface SkillsListProps {
  skills: any[]
  userId: string
}

export const SkillsList = ({ skills, userId }: SkillsListProps) => {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)

      // First check if there are any active exchanges using this skill
      const { data: exchangeData, error: exchangeError } = await supabase.rpc(
        'get_exchanges_by_skill_offering',
        {
          skill_id: id
        }
      )

      if (exchangeError) throw exchangeError

      const activeExchanges = exchangeData?.filter(ex =>
        ['pending', 'accepted', 'in_progress'].includes(ex.exchange_status)
      )

      if (activeExchanges && activeExchanges.length > 0) {
        toast.error(
          'This skill has active exchanges. Please complete or cancel them first.'
        )
        return
      }

      // If no active exchanges, proceed with deletion
      const { error } = await supabase
        .from('skill_offerings')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      toast.success('Your skill has been successfully deleted.')

      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete skill. Please try again.')
    } finally {
      setIsDeleting(null)
    }
  }

  const getExperienceLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800'
      case 'intermediate':
        return 'bg-blue-100 text-blue-800'
      case 'advanced':
        return 'bg-purple-100 text-purple-800'
      case 'expert':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTeachingMethodColor = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'online':
        return 'bg-indigo-100 text-indigo-800'
      case 'in-person':
        return 'bg-amber-100 text-amber-800'
      case 'both':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {skills.map(skill => (
        <Card key={skill.id} className='overflow-hidden'>
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between'>
              <CardTitle className='truncate text-xl' title={skill.title}>
                {skill.title}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/skills/${skill.id}`}>
                      <Eye className='mr-2 h-4 w-4' />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/skills/${skill.id}/edit`}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit Skill
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/exchanges/find?skill=${skill.id}`}>
                      <ArrowLeftRight className='mr-2 h-4 w-4' />
                      Find Exchange Partners
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(skill.id)}
                    disabled={isDeleting === skill.id}
                    className='text-red-600'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    {isDeleting === skill.id ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className='line-clamp-2'>
              {skill.description || 'No description provided.'}
            </CardDescription>
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='mb-3 flex flex-wrap gap-2'>
              {skill.skill_categories?.name && (
                <Badge variant='outline' className='bg-gray-100'>
                  {skill.skill_categories.name}
                </Badge>
              )}
              {skill.experience_level && (
                <Badge
                  variant='outline'
                  className={getExperienceLevelColor(skill.experience_level)}
                >
                  {skill.experience_level}
                </Badge>
              )}
              {skill.teaching_method && (
                <Badge
                  variant='outline'
                  className={getTeachingMethodColor(skill.teaching_method)}
                >
                  {skill.teaching_method}
                </Badge>
              )}
            </div>

            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='flex items-center'>
                <Users className='text-muted-foreground mr-1 h-4 w-4' />
                <span>{skill.exchange_count || 0} exchanges</span>
              </div>
              <div className='flex items-center'>
                <Clock className='text-muted-foreground mr-1 h-4 w-4' />
                <span>{skill.session_duration || 60} min</span>
              </div>
              <div className='flex items-center'>
                <CheckCircle2 className='mr-1 h-4 w-4 text-green-500' />
                <span>{skill.active_exchanges || 0} active</span>
              </div>
              <div className='flex items-center'>
                <XCircle className='mr-1 h-4 w-4 text-amber-500' />
                <span>{skill.pending_exchanges || 0} pending</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='pt-0'>
            <Button asChild className='w-full'>
              <Link href={`/dashboard/exchanges/find?skill=${skill.id}`}>
                <ArrowLeftRight className='mr-2 h-4 w-4' />
                Find Exchange Partners
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
      {skills.length === 0 && (
        <div className='col-span-full py-10 text-center'>
          <p className='text-muted-foreground'>
            You haven't added any skills yet.
          </p>
        </div>
      )}
    </div>
  )
}

export function SkillsListSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {[...Array(3)].map((_, i) => (
        <Card key={i} className='overflow-hidden'>
          <CardHeader className='pb-3'>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='mt-2 h-4 w-full' />
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='mb-3 flex flex-wrap gap-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-5 w-24' />
            </div>
            <div className='grid grid-cols-2 gap-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-full' />
            </div>
          </CardContent>
          <CardFooter className='pt-0'>
            <Skeleton className='h-9 w-full' />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
