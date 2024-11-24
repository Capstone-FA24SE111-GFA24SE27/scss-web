import { FilterAltOutlined, Search, Tune } from '@mui/icons-material'
import { Box, Button, IconButton, Input, InputAdornment, Tab, Tabs, TextField, Tooltip, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { motion } from 'framer-motion'
import { useState, ChangeEvent, useEffect } from 'react'
import { selectCounselorType, selectFilter, setCounselorType, setSearchTerm } from './counselor-list-slice'
import CounselorListFilterButton from './CounselorListFilterButton'
import { debounce } from 'lodash'
import { CounselingType } from '@/shared/types'
import { useSearchParams } from 'react-router-dom'
import { SearchField } from '@/shared/components'

const CounselorListHeader = () => {
  const filter = useAppSelector(selectFilter)
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams();



  const [tabValue, setTabValue] = useState(filter.counselorType === 'ACADEMIC' ? 0 : 1);

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
    dispatch(setCounselorType(counselingType))
  }


  const handleSearch = (searchTerm: string) => {
    dispatch(setSearchTerm(searchTerm))
  }

  return (
    <div className="flex items-center flex-grow-0 flex-shrink-0 bg-background basis-auto">
      <div className="flex flex-col w-full gap-16 p-24">
        <div className='flex'>
          <SearchField
            onSearch={handleSearch}
          />
          {/* <TextField
            label="Search for counselors"
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
          /> */}
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
              className="px-16 mx-4 text-lg font-semibold min-h-40 min-w-64"
              disableRipple
              label="Academic Counselors"
            />
            <Tab
              className="px-16 mx-4 text-lg font-semibold min-h-40 min-w-64"
              disableRipple
              label="Non-Academic Counselors"
            />
          </Tabs>
        </div>
        {/* <Typography variant='h6' color='textSecondary'>Choose your preferred counselor and proceed to book.</Typography> */}
      </div>
    </div >
  )
}

export default CounselorListHeader