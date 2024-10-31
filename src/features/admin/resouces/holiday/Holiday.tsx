import { Heading } from '@/shared/components'
import React from 'react'
import HolidayTable from './HolidayTable'

type Props = {}

const Holiday = (props: Props) => {

    

  const [tabValue, setTabValue] = React.useState(0)
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Holidays Management' description='Manage holidays'/>
      </div>
     
      <div>
        <HolidayTable />
      </div>
    </div>
  )
}

export default Holiday