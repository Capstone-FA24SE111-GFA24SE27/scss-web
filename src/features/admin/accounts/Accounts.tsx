import { FilterTabs, Heading } from '@/shared/components'
import React, { useState } from 'react'
import AccountsTable from './AccountsTable'
import { roles } from '@/shared/constants'
import { Role } from '@/shared/types'


const Accounts = () => {

  const [tabValue, setTabValue] = useState(0)
  const [selectedRole, setSelectedRole] = useState<Role>('STUDENT');

  const accountTabs = [
    { label: 'Academic Counselor', value: roles.ACADEMIC_COUNSELOR },
    { label: 'Non-academic Counselor', value: roles.NON_ACADEMIC_COUNSELOR },
    { label: 'Student', value: roles.STUDENT },
    { label: 'Manager', value: roles.MANAGER },
    { label: 'Support Staffs', value: roles.SUPPORT_STAFF },
  ];

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedRole(accountTabs[newValue ].value as Role)
  };

  return (
    <div>
      <div className='flex flex-col gap-16 p-32'>
        <Heading title='Create Account' description='Enter the required information for new account creatation'/>
        <FilterTabs tabs={accountTabs} tabValue={tabValue} onChangeTab={handleChangeTab}/>
      </div>
      
      <div>
        <AccountsTable selectedRole={selectedRole} />
      </div>
    </div>
  )
}

export default Accounts