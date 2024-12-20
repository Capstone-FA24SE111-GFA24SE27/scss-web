import React, { ChangeEvent, useState } from 'react';
import { List, Tab, Tabs, Typography } from '@mui/material';
import { selectFilter } from './counselor-list-slice';
import { ContentLoading, Pagination } from '@/shared/components';
import {
	useGetCounselorsAcademicForStaffQuery,
	useGetCounselorsNonAcademicForStaffQuery,
} from '../demands/demand-api';
import CounselorListItem from './CounselorListItem';
import { motion } from 'framer-motion';
import CounselorListHeader from './CounselorListHeader';
import { useAppSelector } from '@shared/store';
import { Counselor } from '@/shared/types';

type Props = {
	onPickCounselor: (counselor: Counselor) => void;
};

const CounselorListForStaff = (props: Props) => {
	const { onPickCounselor } = props;

	const [page, setPage] = useState(1);

	const filter = useAppSelector(selectFilter);

	const {
		data: academicCounselors,
		isLoading: isFetchingAcademicCounselors,
	} = useGetCounselorsAcademicForStaffQuery({
		search: filter.searchTerm,
		page,
		availableFrom: filter.availableFrom,
		availableTo: filter.availableTo,
	});
	const {
		data: nonAcademicCounselors,
		isLoading: isFetchingNonAcademicCounselors,
	} = useGetCounselorsNonAcademicForStaffQuery({
		search: filter.searchTerm,
		page,
		availableFrom: filter.availableFrom,
		availableTo: filter.availableTo,
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
	if (isFetchingAcademicCounselors || isFetchingNonAcademicCounselors) {
		return <ContentLoading />;
	}

	return (
		<>
			<CounselorListHeader />
			<motion.div
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				className='flex flex-col flex-auto gap-6 pt-6 pb-16 overflow-y-auto'
			>
				{!counselors?.length ? (
					<div className='flex items-center justify-center flex-1'>
						<Typography color='text.secondary' variant='h5'>
							There are no counselors!
						</Typography>
					</div>
				) : (
					counselors.map((item) => (
						<CounselorListItem
							key={item.profile.id}
							counselor={item}
							onClick={onPickCounselor}
						/>
					))
				)}
				<Pagination
					page={page}
					count={pageCount}
					handleChange={handlePageChange}
				/>
			</motion.div>
		</>
	);
};

export default CounselorListForStaff;
