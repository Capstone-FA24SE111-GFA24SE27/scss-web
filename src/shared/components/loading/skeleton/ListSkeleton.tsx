import { List, Skeleton } from '@mui/material'
import React from 'react'

const ListSkeleton = () => {
  return (
    <List className='flex flex-col gap-8'>
      {
        Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} variant="rectangular" className='w-full h-144 rounded-md' />
        ))
      }
    </List>
  )
}

export default ListSkeleton