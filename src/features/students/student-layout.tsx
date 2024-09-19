import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppLayout } from '@/shared/layouts'
const StudentLayout = () => {
  return (
    <AppLayout>
      <div className='p-8'>
        <Outlet />
      </div>
    </AppLayout>
  )
}

export default StudentLayout