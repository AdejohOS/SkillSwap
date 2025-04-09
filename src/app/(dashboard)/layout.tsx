import { DashboardNavbar } from './dashboard/_components/dashboard-navbar'
import { Sidebar } from './dashboard/_components/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}
const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className='min-h-screen w-full'>
      <div className='fixed inset-y-0 z-30 h-[80px] w-full bg-gray-50 lg:pl-[264px]'>
        <DashboardNavbar />
      </div>
      <div className='fixed top-0 left-0 z-30 hidden h-full flex-col lg:block lg:w-[264px]'>
        <Sidebar />
      </div>

      <div className='h-full overflow-y-auto pt-[80px] lg:pl-[264px]'>
        {children}
      </div>
    </main>
  )
}

export default DashboardLayout
