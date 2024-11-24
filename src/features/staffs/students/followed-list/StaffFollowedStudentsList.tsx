import React, { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppLoading, Pagination } from '@/shared/components';
import { Box, List, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StudentListItem from '@/shared/pages/student-list/StudentListItem';
import { useGetFollowedStudentsStaffQuery } from './staff-followed-student-api';
import FollowedListItem from './FollowedListItem';

type Props = {}

const StaffFollowedStudentsList = (props: Props) => {
    const [page, setPage] = useState(1);

	const dispatch = useDispatch()
	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const { data: data, isLoading: isLoadingStudents } = useGetFollowedStudentsStaffQuery({
		page,
	});

	const students = data?.content.data;

	console.log(students)

	if(isLoadingStudents){
		return <AppLoading />;
	}

  return (
    <div className='flex flex-col flex-1 gap-16 p-16'>
			<Box>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className='flex flex-col flex-auto w-full max-h-full gap-16'
				>

					<List className='w-full gap-16 p-0 m-0'>
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
										<FollowedListItem key={item.followDate} item={item} />
									))
								)}
					</List>
				</motion.div>
			</Box>

			<Pagination
				page={page}
				count={data?.content.totalPages}
				handleChange={handlePageChange}
			/>
		</div>
  )
}

export default StaffFollowedStudentsList