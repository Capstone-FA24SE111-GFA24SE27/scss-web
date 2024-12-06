import { FilterTabs, Heading } from '@/shared/components';
import React, { useState } from 'react';
import AccountsTable from './AccountsTable';
import { roles } from '@/shared/constants';
import { Role } from '@/shared/types';
import { GlobalStyles } from '@mui/material';

const Accounts = () => {
	const [tabValue, setTabValue] = useState(0);

	const accountTabs = [
		{
			label: 'Academic Counselor',
			value: roles.ACADEMIC_COUNSELOR as Role,
		},
		{
			label: 'Non-academic Counselor',
			value: roles.NON_ACADEMIC_COUNSELOR as Role,
		},
		{ label: 'Student', value: roles.STUDENT as Role },
		{ label: 'Manager', value: roles.MANAGER as Role },
		{ label: 'Support Staffs', value: roles.SUPPORT_STAFF as Role },
	];

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<div className='flex flex-col w-full h-full'>
			
			<div className='flex flex-col gap-16 p-32'>
				<Heading
					title='Create Account'
					description='Enter the required information for new account creatation'
				/>
				<FilterTabs
					tabs={accountTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
			</div>

				<AccountsTable selectedRole={accountTabs[tabValue].value} />
		</div>
	);
};

export default Accounts;
