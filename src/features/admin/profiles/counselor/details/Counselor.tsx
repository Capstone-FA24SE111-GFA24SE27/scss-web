import { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
	AppLoading,
	Breadcrumbs,
	Gender,
	Heading,
	PageSimple,
} from '@shared/components';
import {
	Autocomplete,
	Box,
	Chip,
	MenuItem,
	Paper,
	Rating,
	Select,
	Tab,
	Tabs,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { Feedback, Mail, Phone, Star } from '@mui/icons-material';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { z } from 'zod';
import dayjs from 'dayjs';
import AppointmentsTable from './AppointmentsTab';
import RequestsTable from './RequestsTab';
import FeedbackTab from './FeedbackTab';
import {
	useGetCounselingSlotsAdminQuery,
	useGetCounselorAdminQuery,
	useGetCounselorCounselingSlotsAdminQuery,
} from '../admin-counselor-api';
import { truncate } from 'node:fs';

const Root = styled(PageSimple)(({ theme }) => ({
	'& .PageSimple-header': {
		backgroundColor: theme.palette.background.paper,
	},
}));

const daysOfWeek = [
	'MONDAY',
	'TUESDAY',
	'WEDNESDAY',
	'THURSDAY',
	'FRIDAY',
	'SATURDAY',
	'SUNDAY',
];

function Counseling() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const { id } = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const [tabValue, setTabValue] = useState(0);

	const [selectedDay, setSelectedDay] = useState('MONDAY');

	const { data, isLoading } = useGetCounselorAdminQuery(Number(id));
	const counselorData = data?.content;

	const {
		data: counselingSlotsData,
		isLoading: isLoadingCounselingSlotsData,
	} = useGetCounselingSlotsAdminQuery();
	const {
		data: counselorCounselingSlotsData,
		isLoading: isLoadingCounselorCounselingSlotsData,
	} = useGetCounselorCounselingSlotsAdminQuery(Number(id));
	const counselorCounselingSlots = counselorCounselingSlotsData?.content;
	const counselingSlots = counselingSlotsData?.content || [];

	const filteredSlots =
		counselorCounselingSlots?.filter(
			(slot) => slot.dayOfWeek === selectedDay
		) || [];

	console.log(filteredSlots);

	const isMobile = false;

	const location = useLocation();

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	// const handleStatusChange = (e) => {
	//   updateCounselorStatus({
	//     status: e.target.value,
	//     counselorId: Number(id),
	//   })
	// }

	const handleDayChange = (event) => {
		setSelectedDay(event.target.value);
	};

	// const handleSlotsChange = (e, newValue: CounselingSlot[]) => {
	//   // const selectedSlots = counselorData?.counselingSlot
	//   const selectedSlots = filteredSlots
	//   console.log(selectedSlots)
	//   const addedSlot = newValue.find(slot => !selectedSlots.includes(slot));
	//   const removedSlot = selectedSlots.find(slot => !newValue.includes(slot));
	//   console.log(addedSlot, removedSlot);
	//   if (addedSlot) {
	//     updateCounselorCounselingSlots({
	//       counselorId: Number(id),
	//       slotId: addedSlot?.id,
	//       dayOfWeek: selectedDay,
	//     })
	//   }
	//
	//   if (removedSlot) {
	//     deleteCounselorCounselingSlots({
	//       counselorId: Number(id),
	//       slotId: removedSlot?.id
	//     })
	//   }
	// }

	// const handleStartDateChange = (newValue) => {
	//   updateCounselorAvailableDateRange({
	//     counselorId: Number(id),
	//     startDate: dayjs(newValue).format('YYYY-MM-DD'),
	//     endDate: counselorData?.availableDateRange.endDate,
	//   })
	// };

	// const handleEndDateChange = (newValue) => {
	//   updateCounselorAvailableDateRange({
	//     counselorId: Number(id),
	//     startDate: counselorData?.availableDateRange.startDate,
	//     endDate: dayjs(newValue).format('YYYY-MM-DD'),
	//   })
	// };

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.appointmentId));
	}, [routeParams]);

	if (isLoading) {
		return <AppLoading />;
	}
	if (!data) {
		return (
			<Typography color='text.secondary' variant='h5' className='p-16'>
				No counselor
			</Typography>
		);
	}

	return (
		<Root
			header={
				<div className=''>
					<div className='p-16 px-32 space-y-16'>
						<Breadcrumbs
							parents={[
								{
									label: 'Management',
									url: `${location.pathname}`,
								},
								{
									label: 'Counselors',
									url: `/management/counselors`,
								},
							]}
							currentPage={'Nguyễn Văn A4 4'}
						/>
						<div className='flex flex-wrap'>
							<div className='relative flex max-w-sm gap-16 min-w-xs'>
								<img
									src={
										counselorData?.profile.profile
											.avatarLink
									}
									className='border rounded-full size-144'
								/>
								<div className='absolute bg-white border rounded-full bottom-8 left-112'>
									<Gender
										gender={
											counselorData?.profile.profile
												.gender
										}
									/>
								</div>
								<div className='flex flex-col w-full gap-8'>
									<Heading
										title={
											counselorData?.profile.profile
												.fullName
										}
										description={
											counselorData?.profile
												.specialization?.name ||
											counselorData?.profile.expertise
												?.name
										}
									/>
									<Rating
										readOnly
										value={counselorData?.profile.rating}
									/>
									<div className='flex justify-between mt-16 border-t divide-x-1'>
										<Tooltip
											title={
												counselorData?.profile.profile
													.phoneNumber
											}
										>
											<a
												className='flex items-center flex-1 p-8'
												href={`tel${counselorData?.profile.profile.phoneNumber}`}
												role='button'
											>
												<Phone fontSize='small' />
												<Typography className='ml-8'>
													Call
												</Typography>
											</a>
										</Tooltip>
										<Tooltip
											title={counselorData?.profile.email}
										>
											<a
												className='flex items-center justify-end flex-1 p-8'
												href={`mailto:${counselorData?.profile.email}`}
												role='button'
											>
												<Mail fontSize='small' />
												<Typography className='ml-8'>
													Email
												</Typography>
											</a>
										</Tooltip>
									</div>
								</div>
							</div>

							<div className='flex flex-col flex-1 gap-16 ml-120'>
								<div className='flex items-center '>
									<Typography className='font-semibold w-160'>
										Availability Status{' '}
									</Typography>
									<Typography color={counselorData?.profile.status === 'AVAILABLE' ? 'success' : 'warning'} className='font-semibold'>
										{counselorData?.profile.status}
									</Typography>
								</div>
								<div className='flex flex-col justify-center gap-8'>
									<div className='flex items-center w-full'>
										<Typography className='font-semibold w-160'>
											Assigned Slots On
										</Typography>
										<TextField
											size='small'
											select
											value={selectedDay}
											onChange={handleDayChange}
											label='Selected Day'
											variant='outlined'
											className='w-144'
										>
											{daysOfWeek.map((day) => (
												<MenuItem key={day} value={day}>
													{day}
												</MenuItem>
											))}
										</TextField>
									</div>
									<div className='flex items-center gap-8'>
										{filteredSlots?.map((item) => (
											<Chip
												key={item.id}
												label={item.slotCode}
											/>
										))}
									</div>
								</div>
								<div className='flex items-center'>
									<Typography className='font-semibold w-160 '>
										Available date range
									</Typography>
									<div className='flex gap-32'>
										<Typography>
											{
												counselorData
													?.availableDateRange
													.startDate
											}
										</Typography>
										{/* <DatePicker
                      className='h-12'
                      label="Basic date picker"
                      value={dayjs(counselorData?.availableDateRange.startDate)}
                      // onChange={handleStartDateChange}
                      maxDate={dayjs(counselorData?.availableDateRange.endDate)}
                      disabled
                    /> */}
										<div className='font-semibold'>to</div>
										<Typography>
											{
												counselorData
													?.availableDateRange.endDate
											}
										</Typography>
										{/* <DatePicker
                      className='h-12'
                      label="Basic date picker"
                      value={dayjs(counselorData?.availableDateRange.endDate)}
                      // onChange={handleEndDateChange}
                      minDate={dayjs(counselorData?.availableDateRange.startDate)}
                      disabled
                    /> */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<Tabs
						value={tabValue}
						onChange={handleChangeTab}
						indicatorColor='secondary'
						textColor='secondary'
						variant='scrollable'
						scrollButtons='auto'
						classes={{
							root: 'w-full h-32 border-b bg-background-paper px-16',
						}}
					>
						<Tab
							className='px-16 text-lg font-semibold min-h-40 min-w-64'
							label='Appointments'
						/>
						<Tab
							className='px-16 text-lg font-semibold min-h-40 min-w-64'
							label='Requests'
						/>
						<Tab
							className='px-16 text-lg font-semibold min-h-40 min-w-64'
							label='Feedbacks'
						/>
						<Tab
							className='px-16 text-lg font-semibold min-h-40 min-w-64'
							label='Students'
						/>
						<Tab
							className='px-16 text-lg font-semibold min-h-40 min-w-64'
							label='Profile'
						/>
					</Tabs>
				</div>
			}
			content={
				<div className='w-full h-full p-16'>
					<Paper className='h-full p-16 shadow'>
						<div className='w-full pr-8'>
							{tabValue === 0 && <AppointmentsTable />}
							{tabValue === 1 && <RequestsTable />}
							{tabValue === 2 && <FeedbackTab />}
						</div>
					</Paper>
				</div>
			}
			ref={pageLayout}
			rightSidebarContent={<div></div>}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant='temporary'
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Counseling;
