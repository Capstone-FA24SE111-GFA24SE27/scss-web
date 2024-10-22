import { FilterAltOutlined, Search, Tune } from '@mui/icons-material'
import { Box, Button, IconButton, Input, Tab, Tabs, TextField, Tooltip } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { motion } from 'framer-motion'
import { useState, ChangeEvent, useEffect } from 'react'
import { selectCounselorType, selectFilter, setCounselorType, setSearchTerm } from './counselor-list-slice'
import CounselorListFilterButton from './CounselorListFilterButton'
import { debounce } from 'lodash'
import { CounselingType } from '@/shared/types'
import { useSearchParams } from 'react-router-dom'

const CounselorListHeader = () => {
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
        counselingType = 'NON-ACADEMIC'
        break;
      default:
        counselingType = 'ACADEMIC'
        break;
    }
    dispatch(setCounselorType(counselingType))
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
        <div>
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