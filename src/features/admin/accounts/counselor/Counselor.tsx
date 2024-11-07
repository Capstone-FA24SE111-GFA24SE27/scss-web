import { Heading } from '@/shared/components'
import React from 'react'
import CounselorsTable from './CounselorsTable'

type Props = {}

const Counselor = (props: Props) => {

    

  const [tabValue, setTabValue] = React.useState(0)
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Counselors Management' description='Manage academic and non-academic counselors'/>
      </div>
     
      <div>
        <CounselorsTable />
      </div>
    </div>
  )
}

export default Counselor