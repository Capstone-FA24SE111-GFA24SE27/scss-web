import { FilterTabs, Heading, NavLinkAdapter, SearchField } from '@/shared/components'
import { Add } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import SupportStaffsTable from './SupportStaffTable'
import { Outlet } from 'react-router-dom'
import { CounselingType } from '@/shared/types'
import SupportStaffTableFilter from './SupportStaffsTableFilter'

const Students = () => {
  
  return (
    <div className='flex flex-col w-full h-full'>

      <div className='flex items-center justify-between p-32'>
        <Heading title='Support Staffs Management' description='Manage support staffs'/>
      </div>
      <div className='p-16'>
        <SearchField onSearch={function (searchTerm: string): void {
          throw new Error('Function not implemented.')
        } } />
      </div>
        <SupportStaffsTable/>
    </div>
  )
}

export default Students