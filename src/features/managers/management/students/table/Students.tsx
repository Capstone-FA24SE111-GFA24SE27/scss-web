import { FilterTabs, Heading, NavLinkAdapter } from '@/shared/components';
import { Add } from '@mui/icons-material';
import { Box, Button, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import StudentsTable from './StudentsTable';
import { Outlet } from 'react-router-dom';
import { CounselingType } from '@/shared/types';
import StudentListHeader from '@/shared/pages/student-list/StudentListHeader';
import StudentListSidebarContent from '@/shared/pages/student-list/StudentListSidebarContent';

const Students = () => {
	return (
		<div className='flex flex-col w-full h-full'>
			<div className='flex items-center justify-between p-32'>
				<Heading
					title='Students Management'
					description='Manage academic and non-academic counselors'
				/>
			</div>
			<StudentListHeader />
			<div className='flex h-full pl-16 pr-8 overflow-hidden'>
				<StudentsTable />
				<div className='overflow-y-auto w-xs'>
					<StudentListSidebarContent />
				</div>
			</div>
		</div>
	);
};

export default Students;
