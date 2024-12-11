import { FilterTabs, Heading, NavLinkAdapter } from '@/shared/components';
import React, { useState } from 'react';
import AccountsTable from './AccountsTable';
import { roles } from '@/shared/constants';
import { Role } from '@/shared/types';
import { Button, GlobalStyles } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Accounts = () => {
	const [tabValue, setTabValue] = useState(0);
	const navigate = useNavigate();

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
				<div className='flex items-center justify-between gap-8'>
					<FilterTabs
						tabs={accountTabs}
						tabValue={tabValue}
						onChangeTab={handleChangeTab}
					/>
					<Button
						variant='contained'
						color='primary'
						component={NavLinkAdapter}
						role='button'
						to={`/accounts/create/${accountTabs[tabValue]?.value}`}
					>
						<Add />
						Create Acount
					</Button>
				</div>
			</div>

			<AccountsTable selectedRole={accountTabs[tabValue].value} />
		</div>
	);
};

export default Accounts;
