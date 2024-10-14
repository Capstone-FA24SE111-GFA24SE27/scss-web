import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppLayout } from '@shared/layouts'
const ManagersLayout = () => {
  return (
    <AppLayout>
        <Outlet />
    </AppLayout>
  )
}

export default ManagersLayout