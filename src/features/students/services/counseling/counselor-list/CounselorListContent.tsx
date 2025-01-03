import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading, ListSkeleton, Pagination } from '@shared/components';
import { useAppSelector } from '@shared/store';
import CounselorListItem from './CounselorListItem';
import {
	useGetCounselorsAcademicQuery,
	useGetCounselorsNonAcademicQuery,
} from '../counseling-api';
import {
	selectCounselorType,
	selectFilter,
	selectSearchTerm,
} from './counselor-list-slice';
import { useState, ChangeEvent } from 'react';

function CounselorListContent() {
	const [page, setPage] = useState(1);
	const search = useAppSelector(selectSearchTerm);
	const filter = useAppSelector(selectFilter);
	const counselorType = useAppSelector(selectCounselorType);
	const {
		availableFrom,
		availableTo,
		departmentId,
		majorId,
		specializationId,
		expertiseId,
		ratingFrom,
		ratingTo,
	} = filter;
	console.log(availableFrom, availableTo);
	const {
		data: academicCounselors,
		isFetching: isFetchingAcademicCounselors,
	} = useGetCounselorsAcademicQuery({
		search,
		page,
		availableFrom,
		availableTo,
		departmentId,
		majorId,
		specializationId,
		ratingFrom,
		ratingTo,
	});
	const {
		data: nonAcademicCounselors,
		isFetching: isFetchingNonAcademicCounselors,
	} = useGetCounselorsNonAcademicQuery({
		search,
		page,
		availableFrom,
		availableTo,
		expertiseId,
		ratingFrom,
		ratingTo,
	});

	const counselors =
		(counselorType === 'ACADEMIC'
			? academicCounselors?.content?.data
			: nonAcademicCounselors?.content?.data) || [];

	const pageCount =
		counselorType === 'ACADEMIC'
			? academicCounselors?.content?.totalPages
			: nonAcademicCounselors?.content?.totalPages;

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	return (
		<div className='overflow-hidden flex-1'>
			<div className='flex-1 overflow-auto'>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className='flex flex-col flex-auto w-full max-h-full gap-16 pb-16'
				>
					<List className='w-full p-0 m-0 flex flex-col gap-8 px-24'>
						{isFetchingAcademicCounselors ||
							isFetchingNonAcademicCounselors ? (
							<ListSkeleton />
						) : !counselors?.length ? (
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
	);
}

export default CounselorListContent;
