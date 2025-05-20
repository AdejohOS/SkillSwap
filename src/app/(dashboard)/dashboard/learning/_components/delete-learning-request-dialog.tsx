'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Loader, Trash } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createClient } from '@/utils/supabase/client'

interface DeleteLearningRequestDialogProps {
  requestId: string
  requestTitle: string
}

export const DeleteLearningRequestDialog = ({
  requestId,
  requestTitle
}: DeleteLearningRequestDialogProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function deleteRequest() {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('skill_requests')
        .delete()
        .eq('id', requestId)

      if (error) {
        throw error
      }

      toast.success('Learning request deleted')

      setIsOpen(false)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error || typeof error === 'object') {
        toast.error((error as Error)?.message || 'Something went wrong.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the learning request &quot;
            {requestTitle}&quot; and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault()
              deleteRequest()
            }}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
          >
            {isLoading ? (
              <>
                <Loader className='mr-2 h-4 w-4 animate-spin' />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
