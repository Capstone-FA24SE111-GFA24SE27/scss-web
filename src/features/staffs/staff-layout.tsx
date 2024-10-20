import { AppLayout } from '@/shared/layouts'
import React from 'react'
import { Outlet } from 'react-router-dom'

type Props = {}

const StaffLayout = (props: Props) => {
  return (
    <AppLayout>
        <Outlet />
    </AppLayout>
  )
}

export default StaffLayout