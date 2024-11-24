import { FilterTabs, Heading } from '@/shared/components';
import { roles } from '@/shared/constants';
import React, { useState } from 'react'
import { CreateAcademicCounselorForm, CreateManagerForm, CreateNonAcademicCounselorForm, CreateStudentForm, CreateSupportStaffForm } from './forms';
import { Typography } from '@mui/material';


const CreateAccount = () => {

    const [tabValue, setTabValue] = useState(0)

  const createAccountTabs = [
    { label: 'Academic Counselor', value: roles.ACADEMIC_COUNSELOR },
    { label: 'Non-academic Counselor', value: roles.NON_ACADEMIC_COUNSELOR },
    { label: 'Manager', value: roles.MANAGER },
    { label: 'Support Staffs', value: roles.SUPPORT_STAFF },
  ];

  let createAccountForm = <></>;
	switch (createAccountTabs[tabValue]?.value) {
		case roles.STUDENT:
			createAccountForm = <CreateStudentForm />;
			break;
		case roles.ACADEMIC_COUNSELOR:
			createAccountForm = <CreateAcademicCounselorForm />;
			break;
		case roles.NON_ACADEMIC_COUNSELOR:
			createAccountForm = <CreateNonAcademicCounselorForm />;
			break;
		case roles.MANAGER:
			createAccountForm = <CreateManagerForm />;
			break;
		
		case roles.SUPPORT_STAFF:
			createAccountForm = <CreateSupportStaffForm />;
			break;
		default:
			createAccountForm = <Typography color='error' className='font-semibold'>Invalid Tab Value</Typography>;
	}

  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <div className='p-32'>
      <div className='flex items-center justify-between '>
        <Heading title={`Create ${createAccountTabs[tabValue].label}`} description='Enter the required information for new account creatation'/>
      </div>
      <div className='py-16'>
        <FilterTabs tabs={createAccountTabs} tabValue={tabValue} onChangeTab={handleChangeTab}/>
      </div>
      
      <div>
        {createAccountForm}
      </div>
    </div>
  )
}

export default CreateAccount