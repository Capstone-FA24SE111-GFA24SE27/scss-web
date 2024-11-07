import { PageSimple } from '@/shared/components';
import React, { useRef } from 'react';
import StudentList from './StudentList';
import StudentListHeader from './StudentListHeader';
import StudentListSidebarContent from './StudentListSidebarContent';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { filterClose, selectFilter } from './student-list-slice';

type Props = {};

const StudentListLayout = () => {
	const pageLayout = useRef(null);
	const dispatch = useAppDispatch();
	const filter = useAppSelector(selectFilter);
	return (
		<PageSimple
			className='!min-h-screen'
			header={<StudentListHeader />}
			content={<StudentList />}
			ref={pageLayout}
			rightSidebarContent={<StudentListSidebarContent />}
			rightSidebarOpen={filter.open}
			rightSidebarOnClose={() => dispatch(filterClose())}
			rightSidebarVariant='permanent'
			rightSidebarWidth={432}
		/>
	);
};

export default StudentListLayout;
