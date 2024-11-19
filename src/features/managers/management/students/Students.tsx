import { FilterTabs, Heading, NavLinkAdapter } from '@/shared/components'
import { Add } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import StudentsTable from './StudentsTable'
import { Outlet } from 'react-router-dom'
import { CounselingType } from '@/shared/types'

const Students = () => {
  
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Students Management' description='Manage academic and non-academic counselors'/>
      </div>
      <div>
        <StudentsTable/>
      </div>
    </div>
  )
}

export default Students