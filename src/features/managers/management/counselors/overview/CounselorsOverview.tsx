import { Breadcrumbs, FilterTabs } from '@/shared/components'
import React, { useState } from 'react'
import PerformanceOverview from './PerformanceOverview'

const CounselorsOverview = () => {
  const [tabValue, setTabValue] = useState(0)
  const counselingTabs = [
    { label: 'Academic Counselor', value: 'ACADEMIC' },
    { label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
  ];


  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  return (
    <div className='p-16'>
      <Breadcrumbs
        parents={[
          {
            label: "Management",
            url: `${location.pathname}`
          },
          {
            label: "Counselors",
            url: `/management/counselors/overview`
          },
        ]}
        currentPage={`Counselors Overview`}
      />
      <div>
        <div className='mt-16'>
          <FilterTabs tabs={counselingTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
        </div>
        <PerformanceOverview />
      </div>
    </div>
  )
}

export default CounselorsOverview