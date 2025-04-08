import { useQueryState, parseAsBoolean } from 'nuqs'

export const useLoginModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'Login-to-SkillSwap',
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )
  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    open,
    close,
    setIsOpen
  }
}
