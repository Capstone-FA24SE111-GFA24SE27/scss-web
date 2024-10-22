import { Heading, NavLinkAdapter } from '@/shared/components'
import { Add } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React from 'react'
import CounselorsTable from './CounselorsTable'
import { Outlet } from 'react-router-dom'

const Counselors = () => {
  const [tabValue, setTabValue] = React.useState(0)
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Counselors Management' description='Manage academic and non-academic counselors'/>
      </div>
      <div className='p-16'>
        <Tabs
          value={tabValue}
          // onChange={handleChangeTab}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons={false}
          className="w-full min-h-40"
          classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
          TabIndicatorProps={{
            children: (
              <Box
                sx={{ bgcolor: 'primary.light' }}
                className="w-full h-full rounded-full opacity-10"
              />
            )
          }}
        >
          <Tab
            className="text-lg font-semibold min-h-40 min-w-64 mx-4 px-16"
            disableRipple
            label="Academic Counselors"
          />
          <Tab
            className="text-lg font-semibold min-h-40 min-w-64 mx-4 px-16"
            disableRipple
            label="Non-Academic Counselors"
          />
        </Tabs>
      </div>
      <div>
        <CounselorsTable />
      </div>
    </div>
  )
}

export default Counselors