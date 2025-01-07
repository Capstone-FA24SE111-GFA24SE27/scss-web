import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import {
	AppLoading,
	ContentLoading,
	ListSkeleton,
	Pagination,
} from '@shared/components';
import { useAppSelector } from '@shared/store';
import StudentListItem from './StudentListItem';
import { useState, ChangeEvent, useEffect } from 'react';
import { useGetStudentsFilterQuery } from './student-list-api';
import { Box } from '@mui/material';
import { selectFilter } from './student-list-slice';
import clsx from 'clsx';
import _ from 'lodash';

function StudentListContent() {
	const [page, setPage] = useState(1);

	const filter = useAppSelector(selectFilter);

	const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
		setPage(value);
	};

	const {
		searchTerm,
		isUsingPrompt,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
		minGPA,
		maxGPA,
		semesterIdForGPA,
		tab,
		behaviorList,
		typeOfAttendanceFilter,
		semesterIdForAttendance,
		fromForAttendanceCount,
		toForAttendanceCount,
		fromForAttendancePercentage,
		toForAttendancePercentage,
		minSubjectForAttendance,
	} = filter;

	let GPAfilter = {
		minGPA,
		maxGPA,
		semesterIdForGPA,
	};

	const AttendanceFilter =
		typeOfAttendanceFilter === 'COUNT'
			? {
					fromForAttendanceCount,
					toForAttendanceCount,
			  }
			: {
					fromForAttendancePercentage,
					toForAttendancePercentage,
			  };

	useEffect(() => {
		console.log(semesterIdForGPA);
		if (semesterIdForGPA === undefined) {
			GPAfilter = {
				minGPA: undefined,
				maxGPA: undefined,
				semesterIdForGPA: undefined,
			};
		}
	}, [maxGPA, minGPA, semesterIdForGPA]);

	const { data: data, isFetching: isFetchingStudents } =
		useGetStudentsFilterQuery({
			keyword: searchTerm,
			isUsingPrompt,
			promptForBehavior,
			semesterIdForBehavior,
			departmentId,
			majorId,
			specializationId,
			...GPAfilter,
			// minGPA,
			// maxGPA,
			// semesterIdForGPA,
			page,
			tab,
			behaviorList,
			typeOfAttendanceFilter,
			semesterIdForAttendance,
			...AttendanceFilter,
			minSubjectForAttendance,
		});

	useEffect(() => {
		setPage(1);
	}, [
		searchTerm,
		isUsingPrompt,
		promptForBehavior,
		semesterIdForBehavior,
		departmentId,
		majorId,
		specializationId,
		minGPA,
		maxGPA,
		semesterIdForGPA,
		tab,
		behaviorList,
		typeOfAttendanceFilter,
		semesterIdForAttendance,
		fromForAttendanceCount,
		toForAttendanceCount,
		fromForAttendancePercentage,
		toForAttendancePercentage,
		minSubjectForAttendance,
	]);

	const students = data?.data;
	return (
		<div className='flex flex-col flex-1 gap-16 pb-16'>
			<Box>
				<motion.div
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className='flex flex-col flex-auto w-full max-h-full gap-16'
				>
					<List className='flex w-full gap-8 px-24 py-8'>
						{isFetchingStudents ? (
							<ListSkeleton />
						) : !students?.length ? (
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
