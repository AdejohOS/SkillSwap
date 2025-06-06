'use client'
import { ResponsiveModal } from '@/components/responsive-modal'

import { LoginForm } from './login-form'
import { useLoginModal } from '@/hooks/use-login-modal'

export const LoginUserModal = () => {
  const { isOpen, setIsOpen } = useLoginModal()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <LoginForm />
    </ResponsiveModal>
  )
}
