import React, { ChangeEvent, useState } from 'react'
import { useDispatch } from 'react-redux';
import { AppLoading, Pagination, SearchField } from '@/shared/components';
import { Box, List, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import StudentListItem from '@/shared/pages/student-list/StudentListItem';
import { useGetFollowedStudentsStaffQuery } from './staff-followed-student-api';
import FollowedListItem from './FollowedListItem';

type Props = {}

const StaffFollowedStudentsList = (props: Props) => {
    const [page, setPage] = useState(1);
	const [search, setSearch] = useState('')
	const size = 5

	const dispatch = useDispatch()
	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const { data: data, isLoading: isLoadingStudents } = useGetFollowedStudentsStaffQuery({
		page: 1,
		size: 999
	});

	const students = data?.content.data;


	const totalPages = Math.ceil(data?.content.data.length/10)


	const currentItems = students?.slice(
		(page - 1) * size,
		page * size
	  );

	console.log(currentItems)


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
					<SearchField onSearch={setSearch}/>

					<List className='w-full gap-16 p-0 m-0'>
						{
							isLoadingStudents ?
								<AppLoading />
								: !currentItems?.length ? (
									<div className='flex items-center justify-center flex-1'>
										<Typography color='text.secondary' variant='h5'>
											There are no students!
										</Typography>
									</div>
								) : (
									currentItems.map((item) => (
										<FollowedListItem key={item.followDate} item={item} />
									))
								)}
					</List>
				</motion.div>
			</Box>

			<Pagination
				page={page}
				count={totalPages}
				handleChange={handlePageChange}
			/>
		</div>
  )
}

export default StaffFollowedStudentsList