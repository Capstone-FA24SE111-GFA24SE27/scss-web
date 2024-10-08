import { FilterAltOutlined, Search, Tune } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Tab, Tabs, TextField, Tooltip } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { motion } from 'framer-motion'
import { useState, ChangeEvent } from 'react'
import { selectFilter, setCounselorType, setSearchTerm } from './filter-slice'
import CounselorListFilterButton from './CounselorListFilterButton'
import { debounce } from 'lodash'

const CounselorListHeader = () => {
  const filter = useAppSelector(selectFilter)

  const dispatch = useAppDispatch()

  const [tabValue, setTabValue] = useState(0);

  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    setTabValue(value);
    switch (tabValue) {
      case 0:
        dispatch(setCounselorType('ACADEMIC'))
        break;
      case 1:
        dispatch(setCounselorType('NON-ACADEMIC'))
        break;
    }
  }

  const debounceSearch = debounce((debouncedSearchTerm: string) => {
    dispatch(setSearchTerm(debouncedSearchTerm))
  }, 1000);

  function handleSearch(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    debounceSearch(event.target.value)
  }

  return (
    <div className="flex flex-1 items-center bg-background">
      <div className="w-full p-24 flex flex-col gap-16">
        <div className='flex'>
          <TextField
            label="Search for a counselor"
            placeholder="Enter a keyword..."
            className="flex w-full"
            variant="outlined"
            slotProps={{
              inputLabel: {
                shrink: true,
              }
            }}
            onChange={handleSearch}
          />
          <div className='pl-16'>
            {!filter.open && <CounselorListFilterButton />}
          </div>
        </div>
        <div >
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
              label="Academic Counselors"
            />
            <Tab
              className="text-lg font-semibold min-h-40 min-w-64 mx-4 px-16"
              disableRipple
              label="Non-Academic Counselors"
            />
          </Tabs>
        </div>

      </div>
    </div >
  )
}

export default CounselorListHeader