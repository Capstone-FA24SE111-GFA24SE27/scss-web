import { useAppSelector } from '@shared/store';
import React, { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux';
import { selectFilter } from './recommended-list-slice';
import { useGetRecommendedStudentsStaffQuery } from './recommended-students-api';
import { AppLoading, Pagination } from '@/shared/components';
import { Box, List, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StudentListItem from '@/shared/pages/student-list/StudentListItem';


const RecommendedStudentList = () => {

    const [page, setPage] = useState(1);

	const filter = useAppSelector(selectFilter);
	const dispatch = useDispatch()
	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const {
		searchTerm,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
	} = filter;

	const { data: data, isLoading: isLoadingStudents } = useGetRecommendedStudentsStaffQuery({
		keyword: searchTerm,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
		page,
	});

	const students = data?.data;

	console.log(students)
	console.log('filter', filter)

	if(isLoadingStudents){
		return <AppLoading />;
	}

  return (
    <div className='flex flex-col flex-1 gap-16 pb-16'>
			<Box>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className='flex flex-col flex-auto w-full max-h-full gap-16'
				>

					<List className='w-full p-0 m-0'>
						{
							isLoadingStudents ?
								<AppLoading />
								: !students?.length ? (
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
  )
}

export default RecommendedStudentList