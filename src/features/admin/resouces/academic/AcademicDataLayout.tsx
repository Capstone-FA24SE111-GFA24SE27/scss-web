import { FilterTabs, Heading, PageSimple } from '@/shared/components';
import { Box, Button, IconButton, Tab, Tabs } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { navigateUp } from '@/shared/utils';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Add, Close } from '@mui/icons-material';
import { DepartmentsTable } from './departments';
import { MajorsTable } from './majors';
import { SpecializationsTable } from './specializations';
import { SemesterTable } from './semester';
import { clsx } from 'clsx';
import {
	selectAdminAcademicTab,
	setAcademicTab,
} from '../admin-question-card-slice';
import { useAppDispatch, useAppSelector } from '@shared/store';
type Props = {};

const AcademicDataLayout = (props: Props) => {
	const pageLayout = useRef(null);
	const academicTab = useAppSelector(selectAdminAcademicTab);
	const [tabValue, setTabValue] = useState(academicTab);
	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const dispatch = useAppDispatch();

	const navigate = useNavigate();

	const adminAcademicTabs = [
		{ label: 'Departments', value: 'department' },
		{ label: 'Majors', value: 'major' },
		{ label: 'Specializations', value: 'specialization' },
		{ label: 'Semesters', value: 'semester' },
	];

	useEffect(() => {
		if (routeParams.id) {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false);
		}
	}, [routeParams]);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
		dispatch(setAcademicTab(newValue));
	};

	const handleCreate = () => {
		navigate(`${adminAcademicTabs[tabValue].value}/form`);
	};

	return (
		<PageSimple
			ref={pageLayout}
			header={
				<>
					<div className='flex items-center justify-between p-32'>
						<Heading
							title='Problem Tags Management'
							description='Manage problem tags'
						/>
					</div>
					<div className='flex justify-between px-32 py-16'>
						<FilterTabs
							tabValue={tabValue}
							onChangeTab={handleChangeTab}
							tabs={adminAcademicTabs}
						/>

						<Button
							variant='contained'
							color='primary'
							sx={{ color: 'white' }}
							component={Button}
							className={clsx(tabValue === 3 && 'hidden')}
							onClick={handleCreate}
							startIcon={<Add />}
						>
							{tabValue === 0 && 'Create Department'}
							{tabValue === 1 && 'Create Major'}
							{tabValue === 2 && 'Create Specialization'}
						</Button>
					</div>
				</>
			}
			content={
				<>
					{tabValue === 0 && <DepartmentsTable />}
					{tabValue === 1 && <MajorsTable />}
					{tabValue === 2 && <SpecializationsTable />}
					{tabValue === 3 && <SemesterTable />}
				</>
			}
			rightSidebarContent={
				<div className='flex flex-col flex-auto max-w-full w-fit'>
					<IconButton
						className='absolute top-0 right-0 z-10 mx-32 my-16'
						onClick={() => navigate(-1)}
						size='large'
					>
						<Close />
					</IconButton>
					<Outlet />
				</div>
			}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				setRightSidebarOpen(false);
				navigate('.');
			}}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
};

export default AcademicDataLayout;
