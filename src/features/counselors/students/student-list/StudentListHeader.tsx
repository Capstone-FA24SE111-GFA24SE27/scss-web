import { FilterAltOutlined, Search, Tune } from '@mui/icons-material'
import { Box, Button, IconButton, Input, InputAdornment, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { motion } from 'framer-motion'
import { useState, ChangeEvent, useEffect } from 'react'
import { selectStudentType, selectFilter, setStudentType, setSearchTerm } from './student-list-slice'
import StudentListFilterButton from './StudentListFilterButton'
import { debounce } from 'lodash'
import { CounselingType } from '@/shared/types'
import { useSearchParams } from 'react-router-dom'
import { Heading } from '@/shared/components'

const StudentListHeader = () => {
  const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams();

  const [tabValue, setTabValue] = useState(0);

  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    let counselingType: CounselingType = 'ACADEMIC'
    setTabValue(value);
    switch (value) {
      case 0:
        counselingType = 'ACADEMIC'
        break;
      case 1:
        counselingType = 'NON_ACADEMIC'
        break;
      default:
        counselingType = 'ACADEMIC'
        break;
    }
    dispatch(setStudentType(counselingType))
  }

  const debounceSearch = debounce((debouncedSearchTerm: string) => {
    dispatch(setSearchTerm(debouncedSearchTerm))
  }, 500);

  function handleSearch(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    debounceSearch(event.target.value)
  }

  return (
    <div className="flex flex-1 items-center bg-background">
      <div className="w-full p-24 flex flex-col gap-16">
        <div className='flex'>
          <TextField
            label="Search for students"
            placeholder="Enter a keyword..."
            className="flex w-full"
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                )
              }
            }}
            onChange={handleSearch}
          />
          <div className='pl-16'>
            {!filter.open && <StudentListFilterButton />}
          </div>
        </div>
        {/* <div>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
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
              label="Academic Students"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 mx-4 px-16"
              disableRipple
              label="Non-Academic Students"
            />
          </Tabs>
        </div> */}
      </div>
    </div >

  )
}

export default StudentListHeader