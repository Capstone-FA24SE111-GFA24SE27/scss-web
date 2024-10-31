import CounselorsTable from '@/features/managers/management/counselors/CounselorsTable'
import { Heading } from '@/shared/components'
import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useGetProblemTagsQuery } from './problem-tag-api'
import ProblemTagTable from './ProblemTagTable'

type Props = {}

const ProblemTag = (props: Props) => {

    

  const [tabValue, setTabValue] = React.useState(0)
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Problem Tags Management' description='Manage problem tags'/>
      </div>
     
      <div>
        <ProblemTagTable />
      </div>
    </div>
  )
}

export default ProblemTag