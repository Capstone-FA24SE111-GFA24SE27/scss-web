import { AppLayout } from '@/shared/layouts'
import React from 'react'
import { Outlet } from 'react-router-dom'


const StaffLayout = () => {
  return (
    <AppLayout>
        <Outlet />
    </AppLayout>
  )
}

export default StaffLayout