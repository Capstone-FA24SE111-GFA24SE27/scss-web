import { Breadcrumbs, FilterTabs, Scrollbar } from '@/shared/components';
import React, { useState } from 'react';
import PerformanceOverview from './PerformanceOverview';

const CounselorsOverview = () => {
	const [tabValue, setTabValue] = useState(0);
	const counselingTabs = [
		{ label: 'Academic Counselor', value: 'ACADEMIC' },
		{ label: 'Non-academic Counselor', value: 'NON_ACADEMIC' },
	];

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};
	return (
		<div className='h-full overflow-hidden'>
			<Scrollbar className='max-h-full p-16 overflow-auto'>
				<div>
					
					<PerformanceOverview />
				</div>
			</Scrollbar>
		</div>
	);
};

export default CounselorsOverview;
