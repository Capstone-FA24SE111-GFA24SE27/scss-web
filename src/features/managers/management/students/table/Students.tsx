import { FilterTabs, Heading, NavLinkAdapter } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import StudentsTable from './StudentsTable';
import { Outlet } from 'react-router-dom';
import { CounselingType } from '@/shared/types';
import StudentListHeader from '@/shared/pages/student-list/StudentListHeader';
import StudentListFilter from '@/shared/pages/student-list/StudentListSidebarContent';

const Students = () => {
	return (
		<div className='flex flex-col w-full h-full'>
			<div className='flex items-center justify-between p-32 pb-16'>
				<Heading
					title='Students Management'
					description='Manage academic and non-academic counselors'
				/>
			</div>
			<div className='flex overflow-hidden h-full w-full gap-32 px-32 '>
				<div className='flex flex-col w-full gap-8'>
					<StudentListHeader />
					<StudentsTable />
				</div>
				<div className='overflow-y-auto w-sm mt-80'>
					<StudentListFilter shouldShowToggleButton={false} />
				</div>
			</div>
		</div>
	);
};

export default Students;
