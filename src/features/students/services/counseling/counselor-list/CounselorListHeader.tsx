import { FilterTabs, SearchField } from '@/shared/components'
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
  const counselorType = useAppSelector(selectFilter).counselorType
  const [tabValue, setTabValue] = useState(counselorType === 'ACADEMIC' ? 0 : 1)
  function handleChangeTab(event: React.SyntheticEvent, value: number) {
    let newCounselorType: CounselingType = 'ACADEMIC'
    setTabValue(value);
    switch (value) {
      case 0:
        newCounselorType = 'ACADEMIC'
        break;
      case 1:
        newCounselorType = 'NON_ACADEMIC'
        break;
      default:
        newCounselorType = 'ACADEMIC'
        break;
    }
    dispatch(setCounselorType(newCounselorType))
  }


  const counselingTabs = [
    { label: 'Academic Counselor', value: 'ACADEMIC' },
    { label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
  ];


  return (
    <div className="flex items-center flex-1 overflow-hidden bg-background">
      <div className="flex flex-col w-full gap-16 p-24 overflow-auto">
        <div className='flex justify-between'>
          <FilterTabs tabs={counselingTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
          <div className='pl-16'>
            {!filter.open && <CounselorListFilterButton />}
          </div>

        </div>
        {/* <Typography variant='h6' color='textSecondary'>Choose your preferred counselor and proceed to book.</Typography> */}
      </div>
    </div >
  )
}

export default CounselorListHeader