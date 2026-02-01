import JobListingLoading from '@/components/general/JobListingLoading'
import React from 'react'

const SkeletonPage = () => {
  return (
    
    <div className='pt-6 md:pt-8 pb-10'>
      <JobListingLoading/>
    </div>
  )
}

export default SkeletonPage