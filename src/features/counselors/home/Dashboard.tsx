import OverViewTab from '@/features/managers/management/counselors/counselor/OverviewTab'
import { selectAccount, useAppSelector } from '@shared/store'
import React from 'react'

const Dashboard = () => {
  const account = useAppSelector(selectAccount)
  const counselorId = account?.profile.id
  return (
    <div className='p-16 w-full'>
      <OverViewTab counselorId={counselorId?.toString()} />
    </div>
  )
}

export default Dashboard