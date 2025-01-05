import { List, Skeleton } from '@mui/material'
import React from 'react'

const TableSkeleton = () => {
  return (
    <Skeleton variant="rectangular" className='w-full h-md rounded-md' />
  )
}

export default TableSkeleton