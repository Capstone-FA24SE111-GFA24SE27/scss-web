import { closeDialog, NavLinkAdapter, openDialog } from '@/shared/components';
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
import { useAppDispatch } from '@shared/store';
import { AppointmentScheduleType } from '../../calendar-api';
import {
	AccessTime,
	CalendarMonth,
	ChevronRight,
	Circle,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

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
					title={`View ${appointment.studentInfo.profile.fullName}'s profile`}
				>
					<ListItemButton
						component={NavLinkAdapter}
						to={`/counseling/calendar/student/${appointment.studentInfo.profile.id}`}
						className='w-full rounded bg-primary-main/10'
					>
						<div className='flex w-full' onClick={handleNavClicked}>
							<Avatar
								alt={appointment.studentInfo.profile.fullName}
								src={
									appointment.studentInfo.profile.avatarLink
								}
							/>
							<div className='ml-16'>
								<Typography className='font-semibold text-primary-main'>
									{appointment.studentInfo.profile.fullName}
								</Typography>
								<Typography className='font-semibold text-primary-light'>
									{appointment.studentInfo.studentCode}
								</Typography>
							</div>
						</div>
						<ChevronRight />
					</ListItemButton>
				</Tooltip>
				
			</div>
		</div>
	);
};

// const SendFeedbackDialog = ({
// 	appointment,
// }: {
// 	appointment: AppointmentScheduleType;
// }) => {
// 	const [comment, setComment] = useState('');
// 	const [rating, setRating] = useState(0);
// 	const dispatch = useAppDispatch();
// 	const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation();
// 	const handleSendFeedback = () => {
// 		sendFeedback({
// 			appointmentId: Number.parseInt(appointment.id),
// 			feedback: {
// 				comment,
// 				rating,
// 			},
// 		});
// 		dispatch(closeDialog());
// 	};

// 	return (
// 		<div className='w-[40rem]'>
// 			<DialogTitle id='alert-dialog-title'>
// 				Counselling session feedback
// 			</DialogTitle>
// 			<DialogContent>
// 				<DialogContentText id='alert-dialog-description'>
// 					<Typography>Send a feedback</Typography>
// 					<TextField
// 						autoFocus
// 						margin='dense'
// 						name={'comment'}
// 						label={'Comment'}
// 						fullWidth
// 						value={comment}
// 						variant='standard'
// 						className='mt-16'
// 						onChange={(
// 							event: React.ChangeEvent<HTMLInputElement>
// 						) => {
// 							setComment(event.target.value);
// 						}}
// 					/>
// 					<div className='mt-16'>
// 						<Typography component='legend'>
// 							Rate this session
// 						</Typography>
// 						<Rating
// 							name='simple-controlled'
// 							value={rating}
// 							onChange={(event, newRating) => {
// 								setRating(newRating);
// 							}}
// 						/>
// 					</div>
// 				</DialogContentText>
// 			</DialogContent>
// 			<DialogActions>
// 				<Button onClick={() => dispatch(closeDialog())} color='primary'>
// 					Cancel
// 				</Button>
// 				<Button
// 					onClick={() => handleSendFeedback()}
// 					color='secondary'
// 					variant='contained'
// 					disabled={!comment && !rating}
// 				>
// 					Confirm
// 				</Button>
// 			</DialogActions>
// 		</div>
// 	);
// };
