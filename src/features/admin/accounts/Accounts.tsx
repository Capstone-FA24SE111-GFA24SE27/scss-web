import {
	FilterTabs,
	Heading,
	NavLinkAdapter,
	SearchField,
} from '@/shared/components';
import React, { useState } from 'react';
import AccountsTable from './AccountsTable';
import { roles } from '@/shared/constants';
import { Role } from '@/shared/types';
import { Button, GlobalStyles } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	selectViewAccountSearchTerm,
	selectViewAccountTab,
	setAdminViewAccountSearchTerm,
	setAdminViewAccountTab,
} from './admin-view-account-slice';
import AdminCounselorFilter from './filter/AdminCounselorFilter';
import { selectFilter } from './filter/admin-counselor-list-slice';

const Accounts = () => {
	const tab = useAppSelector(selectViewAccountTab);
	const [tabValue, setTabValue] = useState(tab);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const accountTabs = [
		{
			label: 'Academic Counselor',
			value: roles.ACADEMIC_COUNSELOR as Role,
		},
		{
			label: 'Non-academic Counselor',
			value: roles.NON_ACADEMIC_COUNSELOR as Role,
		},
		{ label: 'Manager', value: roles.MANAGER as Role },
		{ label: 'Support Staffs', value: roles.SUPPORT_STAFF as Role },
		{ label: 'Student', value: roles.STUDENT as Role },
	];

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		dispatch(setAdminViewAccountTab(newValue));
	};

	const handleSearch = (searchTerm: string) => {
		dispatch(setAdminViewAccountSearchTerm(searchTerm));
	};

	return (
		<div className='flex flex-col w-full h-full overflow-hidden'>
			<div className='flex flex-col gap-16 p-32'>
				<Heading title='Accounts Table' description='Manage accounts' />
				<div className='flex items-center justify-between gap-8'>
					<FilterTabs
						tabs={accountTabs}
						tabValue={tabValue}
						onChangeTab={handleChangeTab}
					/>
					{tabValue !== 4 && (
						<Button
							variant='contained'
							color='primary'
							component={NavLinkAdapter}
							role='button'
							to={`/accounts/create`}
						>
							<Add />
							Create Account
						</Button>
					)}
				</div>
				<SearchField
					label='Search data'
					placeholder='Enter keyword...'
					onSearch={handleSearch}
					className='w-full'
				/>
			</div>
			<div className='flex w-full h-full gap-8 overflow-hidden'>
				<AccountsTable selectedRole={accountTabs[tabValue].value} />
			</div>
		</div>
	);
};

export default Accounts;
