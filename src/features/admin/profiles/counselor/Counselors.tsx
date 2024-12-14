import { FilterTabs, Heading } from '@/shared/components';
import React, { useState } from 'react';
import CounselorsTable from './CounselorsTable';
import { CounselingType } from '@/shared/types';

const Counselors = () => {
	const [tabValue, setTabValue] = useState(0);
	const counselingTabs = [
		{ label: 'Academic Counselor', value: 'ACADEMIC' },
		{ label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
	];

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};
	return (
    <div className='flex flex-col w-full h-full'>

			<div className='flex items-center justify-between p-32'>
				<Heading
					title='Counselors Management'
					description='Manage academic and non-academic counselors'
				/>
			</div>
			<div className='p-16'>
				<FilterTabs
					tabs={counselingTabs}
					tabValue={tabValue}
					onChangeTab={handleChangeTab}
				/>
			</div>
			<CounselorsTable
				type={counselingTabs[tabValue].value as CounselingType}
			/>
		</div>
	);
};

export default Counselors;
