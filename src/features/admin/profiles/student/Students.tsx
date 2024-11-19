import { Heading } from '@/shared/components'
import React from 'react'
import StudentsTable from './StudentsTable'

type Props = {}

const Counselor = (props: Props) => {

    

  const [tabValue, setTabValue] = React.useState(0)
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Students Management' description='Manage students '/>
      </div>
     
      <div>
        <StudentsTable />
      </div>
    </div>
  )
}

export default Counselor