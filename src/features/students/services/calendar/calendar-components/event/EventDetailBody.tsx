import { closeDialog, NavLinkAdapter, openDialog, UserListItem } from '@/shared/components';
import {
	Avatar,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	ListItemButton,
	Rating,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useSendCouselingAppointmentFeedbackMutation } from '../../../activity/activity-api';
import { useAppDispatch } from '@shared/store';
import {
	AccessTime,
	CalendarMonth,
	ChevronRight,
	Circle,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { AppointmentScheduleType } from '@/shared/types';
import { openCounselorView } from '@/features/students/students-layout-slice';

type Props = {
	appointment: AppointmentScheduleType;
	onNavClicked: () => void;
};

export const EventDetailBody = (props: Props) => {
	const { appointment, onNavClicked } = props;
	const dispatch = useAppDispatch();

	const statusColor = {
		REJECTED: 'error',
		ABSENT: 'error',
		WAITING: 'warning',
		APPROVED: 'success',
		ATTEND: 'success',
	};

	function handleNavClicked() {
		if (onNavClicked) {
			onNavClicked();
		}
		dispatch(openCounselorView(appointment.counselorInfo.profile.id.toString()))

	}

	if (!appointment) {
		return null;
	}

	return (
		<div className='flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480 '>
			<div className='flex flex-col w-full gap-16'>
				<div className='flex gap-24'>
					<div className='flex items-center gap-8'>
						<AccessTime />
						<Typography className=''>
							{dayjs(appointment.startDateTime).format('HH:mm')} -{' '}
							{dayjs(appointment.endDateTime).format('HH:mm')}
						</Typography>
					</div>
					<div className='flex items-center gap-8 '>
						<CalendarMonth />
						<Typography className=''>
							{dayjs(appointment.startDateTime).format(
								'YYYY-MM-DD'
							)}
						</Typography>
					</div>
				</div>
				<div className='flex gap-4'>
					{appointment.meetingType === 'ONLINE' ? (
						<div className='flex items-center gap-24'>
							<Chip
								label='Online'
								icon={<Circle color='success' />}
								className='items-center font-semibold'
							/>
							{appointment.meetUrl && (
								<div>
									<Link
										to={appointment.meetUrl}
										target='_blank'
										className='py-4 px-8 rounded !text-secondary-main !underline'
									>
										Meet URL
									</Link>
								</div>
							)}
						</div>
					) : (
						appointment.address && (
							<div className='flex items-center gap-16'>
								<Typography className='w-68'>
									Address:
								</Typography>
								<Typography className='font-semibold'>
									{appointment.address || ''}
								</Typography>
							</div>
						)
					)}
				</div>
				<div className='flex gap-16'>
					<Typography className='w-68'>Attendance:</Typography>
					<Typography
						className='font-semibold'
						color={statusColor[appointment.status]}
					>
						{appointment.status}
					</Typography>
				</div>
				{/* <div className='flex gap-8'>
                  <Typography className='w-52'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div> */}
				<Tooltip
					title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}
				>
					<ListItemButton
						// component={NavLinkAdapter}
						// to={`/services/calendar/counselor/${appointment.counselorInfo.profile.id}`}
						onClick={handleNavClicked}
						className='w-full rounded bg-primary-main/5'
					>
						<UserListItem
							fullName={appointment.counselorInfo.profile.fullName}
							avatarLink={appointment.counselorInfo.profile.avatarLink}
							phoneNumber={appointment.counselorInfo.profile.phoneNumber}
							email={appointment.counselorInfo.email}
						/>

					</ListItemButton>
				</Tooltip>
				{appointment.appointmentFeedback ? (
					<>
						<div className='w-full'>
							<Divider className='border border-black' />
							<div className='flex items-start gap-16 mt-16'>
								<Typography className='w-96'>
									Your feedback:
								</Typography>

								<div>
									<div>
										<div className='flex items-center gap-8'>
											<Rating
												size='medium'
												value={
													appointment
														.appointmentFeedback
														.rating
												}
												readOnly
											/>
											<Typography color='text.secondary'>
												{dayjs(
													appointment
														.appointmentFeedback
														.createdAt
												).format('YYYY-MM-DD HH:mm:ss')}
											</Typography>
										</div>
									</div>
									<Typography
										className='pl-8 mt-8'
										sx={{ color: 'text.secondary' }}
									>
										{
											appointment.appointmentFeedback
												.comment
										}
									</Typography>
								</div>
							</div>
						</div>
					</>
				) : (
					appointment.status === 'ATTEND' && (
						<>
							<Divider />
							<div className='flex flex-col justify-end w-full gap-8 text-secondary-main '>
								<Typography className='font-semibold'>
									Send feedback about the appointment!
								</Typography>
								<div className='flex gap-16'>
									<Button
										variant='outlined'
										onClick={() =>
											dispatch(
												openDialog({
													children: (
														<SendFeedbackDialog
															appointment={
																appointment
															}
														/>
													),
												})
											)
										}
									>
										Leave a review
									</Button>
								</div>
							</div>
						</>
					)
				)}
			</div>
		</div>
	);
};

const SendFeedbackDialog = ({
	appointment,
}: {
	appointment: AppointmentScheduleType;
}) => {
	const [comment, setComment] = useState('');
	const [rating, setRating] = useState(0);
	const dispatch = useAppDispatch();
	const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation();
	const handleSendFeedback = () => {
		sendFeedback({
			appointmentId: Number.parseInt(appointment.id),
			feedback: {
				comment,
				rating,
			},
		});
		dispatch(closeDialog());
	};

	return (
		<div className='w-[40rem]'>
			<DialogTitle id='alert-dialog-title'>
				Counselling session feedback
			</DialogTitle>
			<DialogContent>
				<DialogContentText id='alert-dialog-description'>
					<Typography>Send a feedback</Typography>
					<TextField
						autoFocus
						margin='dense'
						name={'comment'}
						label={'Comment'}
						fullWidth
						value={comment}
						variant='standard'
						className='mt-16'
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setComment(event.target.value);
						}}
					/>
					<div className='mt-16'>
						<Typography component='legend'>
							Rate this session
						</Typography>
						<Rating
							name='simple-controlled'
							value={rating}
							onChange={(event, newRating) => {
								setRating(newRating);
							}}
						/>
					</div>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => dispatch(closeDialog())} color='primary'>
					Cancel
				</Button>
				<Button
					onClick={() => handleSendFeedback()}
					color='secondary'
					variant='contained'
					disabled={!comment && !rating}
				>
					Confirm
				</Button>
			</DialogActions>
		</div>
	);
};
