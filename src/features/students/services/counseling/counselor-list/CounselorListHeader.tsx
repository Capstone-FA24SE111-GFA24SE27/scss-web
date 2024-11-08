import { SearchField } from '@/shared/components'
import { CounselingType } from '@/shared/types'
import { Box, Tab, Tabs } from '@mui/material'
import { useAppDispatch, useAppSelector } from '@shared/store'
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import CounselorListFilterButton from './CounselorListFilterButton'
import { selectFilter, setCounselorType, setSearchTerm } from './counselor-list-slice'

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
    <div className="flex flex-1 items-center bg-background">
      <div className="w-full p-24 flex flex-col gap-16">
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
        {/* <Typography variant='h6' color='textSecondary'>Choose your preferred counselor and proceed to book.</Typography> */}
      </div>
    </div >
  )
}

export default CounselorListHeader