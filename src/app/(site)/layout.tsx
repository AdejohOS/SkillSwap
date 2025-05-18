import { Footer } from '@/components/footer'
import { NavBar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'

interface SiteLayoutProps {
  children: React.ReactNode
}
const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className='flex min-h-screen flex-col'>
      <NavBar />
      <main className='flex-grow'>{children}</main>
      <Toaster position='top-right' />
      <Footer />
    </main>
  )
}

export default SiteLayout
