import { Heading } from '@/shared/components';
import React from 'react';
import StudentsTable from './StudentsTable';

type Props = {};

const Counselor = (props: Props) => {
	const [tabValue, setTabValue] = React.useState(0);
	return (
		<div className='flex flex-col w-full h-full'>
			<div className='flex items-center justify-between p-32'>
				<Heading
					title='Students Management'
					description='Manage students '
				/>
			</div>

			<StudentsTable />
		</div>
	);
};

export default Counselor;
