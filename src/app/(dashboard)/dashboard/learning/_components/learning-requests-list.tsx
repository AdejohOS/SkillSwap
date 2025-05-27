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
  CheckCircle2,
  XCircle,
  ArrowLeftRight,
  Coins
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

type LearningRequest = {
  id: string
  title: string
  description: string | null
  desired_level:
    | 'Beginner'
    | 'Intermediate'
    | 'Advanced'
    | 'Expert'
    | string
    | null
  skill_categories: {
    name: string
  } | null
  has_matches: boolean | null
  exchange_count?: number
  active_exchanges?: number
  pending_exchanges?: number
}

interface EnoughCredit {
  id: string
  desired_level: string
}

interface LearningRequestsListProps {
  requests: LearningRequest[]
  userId: string
  creditBalance?: number
}

export function LearningRequestsList({
  requests,
  userId,
  creditBalance = 0
}: LearningRequestsListProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id)

      // First check if there are any active exchanges using this request
      const { data: exchangeData, error: exchangeError } = await supabase.rpc(
        'get_exchanges_by_skill_request',
        {
          request_id: id
        }
      )

      if (exchangeError) {
        console.error('Error checking exchanges:', exchangeError)
        // Continue with deletion even if we can't check exchanges
      } else {
        const activeExchanges = exchangeData?.filter(ex =>
          ['pending', 'accepted', 'in_progress'].includes(ex.exchange_status)
        )

        if (activeExchanges && activeExchanges.length > 0) {
          toast.error(
            'This request has active exchanges. Please complete or cancel them first.'
          )
          return
        }
      }

      // Proceed with deletion
      const { error } = await supabase
        .from('skill_requests')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)

      if (error) throw error

      toast.success('Your learning request has been successfully deleted.')

      router.refresh()
    } catch (error: unknown) {
      console.error('Delete error:', error)
      if (error instanceof Error) {
        toast(
          error.message ||
            'Failed to delete learning request. Please try again.'
        )
      }
    } finally {
      setIsDeleting(null)
    }
  }
  const getDesiredLevelColor = (level: string) => {
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

  const hasEnoughCredits = (desired_level: string) => {
    // Determine credit cost based on desired level
    const creditCost = getCreditCost(desired_level)
    return creditBalance >= creditCost
  }

  const getCreditCost = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
        return 5
      case 'intermediate':
        return 10
      case 'advanced':
        return 15
      case 'expert':
        return 20
      default:
        return 5
    }
  }

  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {requests.map(request => (
        <Card key={request.id} className='overflow-hidden'>
          <CardHeader className='pb-3'>
            <div className='flex items-start justify-between'>
              <CardTitle className='truncate text-xl' title={request.title}>
                {request.title}
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='ghost'
                    className='h-8 w-8 p-0'
                    aria-label='More options'
                  >
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/learning/${request.id}`}>
                      <Eye className='mr-2 h-4 w-4' />
                      View Details
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/learning/${request.id}/edit`}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit Request
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/discover?request=${request.id}`}>
                      <ArrowLeftRight className='mr-2 h-4 w-4' />
                      Find Teachers
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleDelete(request.id)}
                    disabled={isDeleting === request.id}
                    className='text-red-600'
                  >
                    <Trash2 className='mr-2 h-4 w-4' />
                    {isDeleting === request.id ? 'Deleting...' : 'Delete'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className='line-clamp-2'>
              {request.description || 'No description provided.'}
            </CardDescription>
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='mb-3 flex flex-wrap gap-2'>
              {request.skill_categories?.name && (
                <Badge variant='outline' className='bg-gray-100'>
                  {request.skill_categories.name}
                </Badge>
              )}
              {request.desired_level && (
                <Badge
                  variant='outline'
                  className={getDesiredLevelColor(request.desired_level)}
                >
                  {request.desired_level}
                </Badge>
              )}
              {request.has_matches && (
                <Badge
                  variant='outline'
                  className='bg-green-100 text-green-800'
                >
                  Matches Found
                </Badge>
              )}
            </div>

            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div className='flex items-center'>
                <Users className='text-muted-foreground mr-1 h-4 w-4' />
                <span>{request.exchange_count || 0} exchanges</span>
              </div>
              <div className='flex items-center'>
                <Coins className='mr-1 h-4 w-4 text-amber-500' />
                <span>
                  {getCreditCost(request.desired_level || '')} credits
                </span>
              </div>
              <div className='flex items-center'>
                <CheckCircle2 className='mr-1 h-4 w-4 text-green-500' />
                <span>{request.active_exchanges || 0} active</span>
              </div>
              <div className='flex items-center'>
                <XCircle className='mr-1 h-4 w-4 text-amber-500' />
                <span>{request.pending_exchanges || 0} pending</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex flex-col gap-2 pt-0'>
            <Button asChild className='w-full'>
              <Link href={`/dashboard/discover?request=${request.id}`}>
                <ArrowLeftRight className='mr-2 h-4 w-4' />
                Find Exchange Partners
              </Link>
            </Button>
            {hasEnoughCredits(request.desired_level || '') && (
              <Button variant='outline' asChild className='w-full'>
                <Link href={`/dashboard/credits/use?request=${request.id}`}>
                  <Coins className='mr-2 h-4 w-4' />
                  Use {getCreditCost(request.desired_level || '')} Credits
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
      {requests.length === 0 && (
        <div className='col-span-full py-10 text-center'>
          <p className='text-muted-foreground'>
            You haven&apos;t added any learning requests yet.
          </p>
        </div>
      )}
    </div>
  )
}

export function LearningRequestsListSkeleton() {
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
