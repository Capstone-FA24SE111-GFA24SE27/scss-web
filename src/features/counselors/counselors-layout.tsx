import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppLayout } from '@shared/layouts'
const CounselorsLayout = () => {
  return (
    <AppLayout>
        <Outlet />
    </AppLayout>
  )
}

export default CounselorsLayout