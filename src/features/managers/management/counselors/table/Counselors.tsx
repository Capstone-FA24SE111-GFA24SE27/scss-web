import {
	FilterTabs,
	Heading,
	NavLinkAdapter,
	Scrollbar,
	SearchField,
} from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import CounselorsTable from './CounselorsTable';
import { Outlet } from 'react-router-dom';
import { CounselingType } from '@/shared/types';
import CounselorsTableFilter from './CounselorsTableFilter';
import { useAppDispatch } from '@shared/store';
import { setCounselingTab, setCounselorType, setSearchTerm } from './counselor-list-slice';

const Counselors = () => {
	const [tabValue, setTabValue] = useState(0);
	const dispatch = useAppDispatch()
	const counselingTabs = [
		{ label: 'Academic Counselor', value: 'ACADEMIC' },
		{ label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
	];




	const handleChangeTab = (event: React.SyntheticEvent, value: number) => {
		let newCounselorType: CounselingType = 'ACADEMIC'
		setTabValue(value);
		switch (value) {
			case 0:
				newCounselorType = 'ACADEMIC'
				break;
			case 1:
				newCounselorType = 'NON_ACADEMIC'
				break;
			default:
				newCounselorType = 'ACADEMIC'
				break;
		}
		dispatch(setCounselorType(newCounselorType))
	};

	return (
		<div className='flex flex-col w-full h-full'>
			<div className='flex items-center justify-between p-32 pb-16'>
				<Heading
					title='Counselors Management'
					description='Manage academic and non-academic counselors'
				/>
			</div>
			<div className='px-36 space-y-16'>
				<FilterTabs
					tabs={counselingTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
			</div>

			<div className='flex h-full overflow-hidden px-32 gap-16 mt-16'>
				<CounselorsTable
					type={counselingTabs[tabValue].value as CounselingType}
				/>
				<Scrollbar className='flex max-h-full overflow-auto'>
					<CounselorsTableFilter />
				</Scrollbar>
			</div>
		</div>
	);
};

export default Counselors;
