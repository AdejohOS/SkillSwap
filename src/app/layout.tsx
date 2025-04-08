import type { Metadata } from 'next'
import './globals.css'
import { Figtree } from 'next/font/google'
import { cn } from '@/lib/utils'
import { LoginUserModal } from '@/components/auth/login-modal'
import { NuqsAdapter } from 'nuqs/adapters/next'
import { Toaster } from '@/components/ui/sonner'
import { QueryClientProvider } from '@/providers/query-provider'

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    template: ' %s | SkillSwap',
    default: 'Teach a skill in exchange for learning another'
  },
  description:
    'Anyone can offer to teach a skill in exchange for learning another — no money involved, just value-for-value exchange.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn(
          `font-sans text-neutral-500 antialiased`,
          figtree.className
        )}
      >
        <NuqsAdapter>
          <QueryClientProvider>
            <LoginUserModal />
            {children}
          </QueryClientProvider>
        </NuqsAdapter>
        <Toaster position='top-right' />
      </body>
    </html>
  )
}
