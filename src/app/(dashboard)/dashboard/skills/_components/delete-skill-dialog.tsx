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

import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'

interface DeleteSkillDialogProps {
  skillId: string
  skillTitle: string
}

export function DeleteSkillDialog({
  skillId,
  skillTitle
}: DeleteSkillDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function deleteSkill() {
    setIsLoading(true)

    try {
      const { error } = await supabase
        .from('skill_offerings')
        .delete()
        .eq('id', skillId)

      if (error) {
        throw error
      }

      toast.success('Your skill has been deleted successfully.')

      setIsOpen(false)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className='flex w-full items-center justify-start'
        >
          <Trash className='mr-2 h-4 w-4' />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the skill &quot;{skillTitle}&quot; and
            remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault()
              deleteSkill()
            }}
            className='bg-destructive hover:bg-destructive/90 text-white'
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
