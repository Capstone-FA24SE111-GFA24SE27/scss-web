import { Heading } from '@/shared/components'
import React from 'react'
import AccountsTable from './AccountsTable'


const Accounts = () => {
  return (
    <div>
      <div className='flex items-center justify-between p-32'>
        <Heading title='Create Account' description='Enter the required information for new account creatation'/>
      </div>
      
      <div>
        <AccountsTable />
      </div>
    </div>
  )
}

export default Accounts