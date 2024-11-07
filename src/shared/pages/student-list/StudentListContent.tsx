import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import { AppLoading, ContentLoading, Pagination } from '@shared/components';
import { useAppSelector } from '@shared/store';
import StudentListItem from './StudentListItem';
import { useState, ChangeEvent, useEffect } from 'react';
import {
	useGetRecommendedStudentsQuery,
	useGetStudentsFilterQuery,
} from './student-list-api';
import { Box } from '@mui/material';
import { resetFilter, selectFilter } from './student-list-slice';
import { useDispatch } from 'react-redux';

function StudentListContent() {
	const [page, setPage] = useState(1);

	const filter = useAppSelector(selectFilter);
	const dispatch = useDispatch()
	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const {
		searchTerm,
		isIncludeBehavior,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
		minGPA,
		maxGPA,
		semesterIdForGPA,
		tab
	} = filter;

	

	// const useConditionalQuery = isApiGetRecommended
	// 	? (param) => {
	// 			console.log('using recommended');
	// 			return useGetRecommendedStudentsQuery({
	// 				keyword: param.keyword,
	// 				promptForBehavior: param.promptForBehavior,
	// 				semesterIdForBehavior: param.semesterIdForBehavior,
	// 				departmentId: param.departmentId,
	// 				majorId: param.majorId,
	// 				specializationId: param.specializationId,
	// 				page: param.page,
	// 			});
	// 	  }
	// 	: ({
	// 			keyword,
	// 			isIncludeBehavior,
	// 			promptForBehavior,
	// 			semesterIdForBehavior,
	// 			departmentId,
	// 			majorId,
	// 			specializationId,
	// 			minGPA,
	// 			maxGPA,
	// 			semesterIdForGPA,
	// 			page,
	// 	  }) => {
	// 			console.log('using default');
	// 			return useGetStudentsFilterQuery({
	// 				keyword,
	// 				isIncludeBehavior,
	// 				promptForBehavior,
	// 				semesterIdForBehavior,
	// 				departmentId,
	// 				majorId,
	// 				specializationId,
	// 				minGPA,
	// 				maxGPA,
	// 				semesterIdForGPA,
	// 				page,
	// 			});
	// 	  };

	const { data: data } = useGetStudentsFilterQuery({
		keyword: searchTerm,
		isIncludeBehavior,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
		minGPA,
		maxGPA,
		semesterIdForGPA,
		page,
		tab
	});

	const students = data?.data;
	return (
		<div className='flex flex-col flex-1 gap-16 pb-16'>
			<Box>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className='flex flex-col flex-auto w-full max-h-full gap-16'
				>
					<List className='w-full p-0 m-0'>
						{!students?.length ? (
							<div className='flex items-center justify-center flex-1'>
								<Typography color='text.secondary' variant='h5'>
									There are no students!
								</Typography>
							</div>
						) : (
							students.map((item) => (
								<StudentListItem key={item.id} student={item} />
							))
						)}
					</List>
				</motion.div>
			</Box>

			<Pagination
				page={page}
				count={data?.totalPages}
				handleChange={handlePageChange}
			/>
		</div>
	);
}
export default StudentListContent;
