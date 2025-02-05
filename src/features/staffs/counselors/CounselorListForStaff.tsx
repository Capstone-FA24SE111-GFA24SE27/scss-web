import React, { ChangeEvent, useRef, useState } from 'react';
import { Button, List, Tab, Tabs, Typography } from '@mui/material';
import {
	filterClose,
	selectFilter,
	setSelectedCounselor,
} from './counselor-list-slice';
import {
	ContentLoading,
	Heading,
	NavLinkAdapter,
	PageSimple,
	Pagination,
} from '@/shared/components';
import {
	useGetCounselorsAcademicForStaffQuery,
	useGetCounselorsNonAcademicForStaffQuery,
} from '../demands/demand-api';
import CounselorListItem from './CounselorListItem';
import CounselorListHeader from './CounselorListHeader';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { Counselor } from '@/shared/types';
import CounselorListSidebarContent from './CounselorListSidebarContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateUp } from '@/shared/utils';
import { motion } from 'framer-motion';
import { ArrowBack } from '@mui/icons-material';

type Props = {
	onPickCounselor?: (counselor: Counselor) => void;
};

const CounselorListForStaff = (props: Props) => {
	const { onPickCounselor } = props;
	const location = useLocation();
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const dispatch = useAppDispatch();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const filter = useAppSelector(selectFilter);
	const {
		searchTerm,
		departmentId,
		majorId,
		specializationId,
		expertiseId,
		ratingFrom,
		ratingTo,
		gender,
		availableFrom,
		availableTo,
	} = filter;

	const {
		data: academicCounselors,
		isLoading: isFetchingAcademicCounselors,
	} = useGetCounselorsAcademicForStaffQuery({
		search: searchTerm,
		page,
		departmentId,
		majorId,
		specializationId,
		ratingFrom,
		ratingTo,
		gender,
		availableFrom,
		availableTo,
	});
	const {
		data: nonAcademicCounselors,
		isLoading: isFetchingNonAcademicCounselors,
	} = useGetCounselorsNonAcademicForStaffQuery({
		search: filter.searchTerm,
		page,
		expertiseId,
		ratingFrom,
		ratingTo,
		gender,
		availableFrom,
		availableTo,
	});

	const counselors =
		(filter.counselorType === 'ACADEMIC'
			? academicCounselors?.content?.data
			: nonAcademicCounselors?.content?.data) || [];

	const pageCount =
		filter.counselorType === 'ACADEMIC'
			? academicCounselors?.content?.totalPages
			: nonAcademicCounselors?.content?.totalPages;

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const handlePickCounselor = (counselor: Counselor) => {
		if (counselor) {
			dispatch(setSelectedCounselor(counselor));
			navigate(-1);
		}
	};

	const pageLayout = useRef(null);

	const isMobile = false;
	return (
		<PageSimple
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => {
				navigate('.');
				setRightSidebarOpen(false);
			}}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
			header={
				<div className='flex flex-col gap-8 px-32 pt-16'>
					<motion.div
						initial={{ x: 20, opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: { delay: 0.3 },
						}}
					>
						<Button
							className='flex items-center w-fit'
							component={NavLinkAdapter}
							role='button'
							to={navigateUp(location, 1)}
							color='inherit'
						>
							<ArrowBack />
							<span className='flex mx-4 font-medium'>
								Demand Form
							</span>
						</Button>
					</motion.div>

					<Heading
						title='Counselor List'
						description='Select a counselor to be assigned for the demand'
					/>
				</div>
			}
			content={
				<PageSimple
					className='h-full'
					header={<CounselorListHeader />}
					content={
						<div className='flex-1 overflow-hidden'>
							<div className='flex-1 overflow-auto'>
								<motion.div
									initial={{ y: 20, opacity: 0 }}
									animate={{
										y: 0,
										opacity: 1,
										transition: { delay: 0.2 },
									}}
									className='flex flex-col flex-auto w-full max-h-full gap-16 pb-16'
								>
									<List className='w-full gap-8 px-16 m-0'>
										{isFetchingAcademicCounselors ||
										isFetchingNonAcademicCounselors ? (
											<ContentLoading className='h-screen' />
										) : !counselors?.length ? (
											<div className='flex items-center justify-center flex-1'>
												<Typography
													color='text.secondary'
													variant='h5'
												>
													There are no counselors!
												</Typography>
											</div>
										) : (
											counselors.map((item, index) => (
												<CounselorListItem
													key={index}
													counselor={item}
													onClick={
														handlePickCounselor
													}
												/>
											))
										)}
									</List>
								</motion.div>
								<Pagination
									page={page}
									count={pageCount}
									handleChange={handlePageChange}
								/>
							</div>
						</div>
					}
					ref={pageLayout}
					rightSidebarContent={<CounselorListSidebarContent />}
					rightSidebarOpen={filter.open}
					rightSidebarOnClose={() => {
						dispatch(filterClose());
					}}
					rightSidebarVariant='permanent'
					rightSidebarWidth={432}
				/>
			}
		/>
	);
};

export default CounselorListForStaff;
