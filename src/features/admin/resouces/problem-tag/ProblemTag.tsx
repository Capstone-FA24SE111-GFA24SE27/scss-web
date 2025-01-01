import { FilterTabs, Heading, PageSimple } from '@/shared/components';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useGetProblemTagsQuery } from './problem-tag-api';
import ProblemTagTable from './ProblemTagTable';
import CategoryTable from './CategoryTable';
import CreateProblemTagButton from './CreateProblemTagButton';
import CreateCategoryButton from './CreateCategoryButton';
import { navigateUp } from '@/shared/utils';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Close } from '@mui/icons-material';

type Props = {};

const ProblemTag = (props: Props) => {
	const pageLayout = useRef(null);
	const [tabValue, setTabValue] = React.useState(0);
	const routeParams = useParams();
	const isMobile = false;
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const problemTagTabs = [
		{ label: 'Tag', value: 'TAG' },
		{ label: 'Category', value: 'CATEGORY' },
	];
	const navigate = useNavigate();

	useEffect(() => {
		if (routeParams.id || location.pathname.split('/').pop() === 'create') {
			setRightSidebarOpen(true);
		} else {
			setRightSidebarOpen(false);
		}
	}, [routeParams]);

	const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	return (
		<PageSimple
			ref={pageLayout}
			header={
				<>
					<div className='flex flex-col gap-16 p-32'>
						<Heading
							title='Problem Tags Management'
							description='Manage problem tags'
						/>
						<div className='flex justify-between '>
							<FilterTabs
								tabValue={tabValue}
								onChangeTab={handleChangeTab}
								tabs={problemTagTabs}
							/>
							<div>
								{tabValue === 0 ? (
									<CreateProblemTagButton />
								) : (
									<CreateCategoryButton />
								)}
							</div>
						</div>
					</div>
				</>
			}
			content={tabValue === 0 ? <ProblemTagTable /> : <CategoryTable />}
			rightSidebarContent={
				<div className='flex flex-col flex-auto max-w-full w-fit'>
					<IconButton
						className='absolute top-0 right-0 z-10 mx-32 my-16'
						onClick={() => navigate('.')}
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

export default ProblemTag;
