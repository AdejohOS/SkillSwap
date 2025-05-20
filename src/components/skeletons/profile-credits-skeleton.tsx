export const ProfileCreditsSkeleton = () => {
  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-3'>
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className='space-y-4 rounded-lg border p-4'>
              <div className='space-y-2'>
                <div className='bg-muted h-4 w-1/2 animate-pulse rounded'></div>
                <div className='bg-muted h-8 w-1/3 animate-pulse rounded'></div>
              </div>
              {i === 0 && (
                <div className='bg-muted h-9 w-full animate-pulse rounded'></div>
              )}
              {i !== 0 && (
                <div className='bg-muted h-4 w-3/4 animate-pulse rounded'></div>
              )}
            </div>
          ))}
      </div>

      <div className='space-y-4'>
        <div className='bg-muted h-6 w-40 animate-pulse rounded'></div>

        <div className='space-y-3'>
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center gap-3'>
                  <div className='bg-muted h-9 w-9 animate-pulse rounded-full'></div>
                  <div className='space-y-2'>
                    <div className='bg-muted h-5 w-40 animate-pulse rounded'></div>
                    <div className='bg-muted h-4 w-24 animate-pulse rounded'></div>
                  </div>
                </div>
                <div className='bg-muted h-5 w-20 animate-pulse rounded'></div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
