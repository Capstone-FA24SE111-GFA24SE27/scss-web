import { FilterTabs, Heading, NavLinkAdapter } from '@/shared/components'
import { Add } from '@mui/icons-material'
import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import React, { useState } from 'react'
import CounselorsTable from './CounselorsTable'
import { Outlet } from 'react-router-dom'
import { CounselingType } from '@/shared/types'
import CounselorsTableFilter from './CounselorsTableFilter'
import { setSearchTerm } from './counselor-list-slice'
import { useAppDispatch } from '@shared/store'

const Counselors = () => {
  const [tabValue, setTabValue] = useState(0)
  const counselingTabs = [
    { label: 'Academic Counselor', value: 'ACADEMIC' },
    { label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
  ];

  const dispatch = useAppDispatch()
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm))
  }
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Counselors Management' description='Manage academic and non-academic counselors' />
      </div>
      <div className='p-16 space-y-16'>
        <SearchField
          onSearch={handleSearch}
        />
        <FilterTabs tabs={counselingTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
      </div>
      <div className='flex gap-16'>
        <CounselorsTable type={(counselingTabs[tabValue].value as CounselingType)} />
        <CounselorsTableFilter />
      </div>
    </div>
  )
}

export default Counselors