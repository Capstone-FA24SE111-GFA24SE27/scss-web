import { Heading } from '@/shared/components'
import React from 'react'
import SupportStaffsTable from './SupportStaffsTable'

type Props = {}

const SupportStaffs = (props: Props) => {
    <div>
    <div className='flex items-center justify-between p-32'>
      <Heading title='Support Staffs Management' description='Manage support staffs '/>
    </div>
   
    <div>
      <SupportStaffsTable />
    </div>
  </div>
}

export default SupportStaffs