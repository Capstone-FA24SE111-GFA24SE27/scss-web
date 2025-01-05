import {
	Avatar,
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	IconButton,
	ListItemButton,
	Paper,
	Rating,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	AccessTime,
	Add,
	CalendarMonth,
	Circle,
	Clear,
	EditNote,
	Summarize,
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useGetAppointmentByIdQuery } from './appointment-api';
import {
	AppLoading,
	AppointmentReport,
	ContentLoading,
	UserLabel,
	UserListItem,
} from '@/shared/components';
import { useAppDispatch } from '@shared/store';
import { AppointmentRequest } from '@/shared/types';

const AppointmentRequestDetail = ({ id, appointment }: { id?: string, appointment?: AppointmentRequest }) => {
	// const { id: appointmentRouteId } = useParams();
	// const appointmentId = id || appointmentRouteId;
	// const { data: appointmentData, isLoading } =
	// 	useGetAppointmentByIdQuery(appointmentId);
	// const appointment = appointmentData?.content;
	const navigate = useNavigate();
	const [openDialog, setOpenDialog] = useState(null);

	const dispatch = useAppDispatch();
	// Appointment status color
	const statusColor = {
		ATTEND: 'success',
		ABSENT: 'error',
		WAITING: 'warning',
		CANCELED: 'default',
	};

	if (!appointment) {
		return (
			<Box className={`p-36 flex items-center justify-center max-w-md `}>
				<Typography variant='h5' color='textSecondary'>
					No request
				</Typography>
			</Box>
		);
	}

	return (
		<Box className={`p-36 flex flex-col gap-16 max-w-md mt-12`}>
			<Typography className='font-extrabold leading-none tracking-tight text-20 md:text-24'>
				Appointment Request Details
			</Typography>
			<div className='flex gap-24 pb-8'>
				<div className='flex items-center gap-24'>
					<div className='flex items-center gap-8 '>
						<CalendarMonth />
						<Typography className=''>
							{dayjs(appointment.startTime).format(
								'YYYY-MM-DD'
							)}
						</Typography>
					</div>
					<div className='flex items-center gap-8'>
						<AccessTime />
						<Typography className=''>
							{dayjs(appointment.startTime).format('HH:mm')} -{' '}
							{dayjs(appointment.endTime).format('HH:mm')}
						</Typography>
					</div>
					<Chip
						label={
							appointment.meetingType == 'ONLINE'
								? 'Online'
								: 'Offline'
						}
						icon={
							<Circle
								color={
									appointment.meetingType == 'ONLINE'
										? 'success'
										: 'disabled'
								}
							/>
						}
						className='items-center font-semibold'
						size='small'
					/>
					{['CANCELED'].includes(appointment?.status) && (
						<Chip
							label={appointment.status}
							variant='filled'
							color={statusColor[appointment.status]}
							size='small'
						/>
					)}
					<Chip
						label={appointment.status}
						variant='filled'
						color={statusColor[appointment.status]}
						size='small'
					/>
				</div>
			</div>

			<Divider />

			<div className='flex flex-col gap-32'>
				<div className='flex flex-col flex-1 gap-8 rounded'>
					<Typography className='text-lg font-semibold text-primary-light'>
						Counselee
					</Typography>
					<div className='flex justify-start gap-16 rounded'>
						<UserListItem
							fullName={appointment.student.profile.fullName}
							avatarLink={
								appointment.student.profile.avatarLink
							}
							phoneNumber={
								appointment.student.profile.phoneNumber
							}
							email={appointment.student.email}
						/>
					</div>
				</div>
				<div className='flex flex-col flex-1 gap-8 rounded'>
					<Typography className='text-lg font-semibold text-primary-light'>
						Counselor
					</Typography>
					<div className='flex justify-start gap-16 rounded'>
						<UserListItem
							fullName={
								appointment.counselor.profile.fullName
							}
							avatarLink={
								appointment.counselor.profile.avatarLink
							}
							phoneNumber={
								appointment.counselor.profile.phoneNumber
							}
							email={appointment.counselor.email}
						/>
					</div>
				</div>
			</div>

			<Divider />

			<div className='flex gap-4 mb-8 '>
				{appointment.meetingType === 'ONLINE' ? (
					<div className='flex items-center gap-24'>
						{appointment.appointmentDetails?.meetUrl && (
							<div className='flex flex-col gap-8'>
								<Typography className='text-lg font-semibold text-primary-light'>
									Location:
								</Typography>
								<Link
									to={appointment.appointmentDetails?.meetUrl}
									target='_blank'
									className='py-4 px-8 rounded !text-secondary-main !underline'
								>
									{appointment.appointmentDetails?.meetUrl}
								</Link>
							</div>
						)}
					</div>
				) : (
					appointment.appointmentDetails?.address && (
						<div className='flex flex-col items-center gap-8'>
							<Typography className='text-lg font-semibold text-primary-light'>
								Address:
							</Typography>
							<Typography className='font-semibold'>
								{appointment.appointmentDetails?.address || ''}
							</Typography>
						</div>
					)
				)}
			</div>

			<Divider />

			<div className='flex flex-col gap-8'>
				<Typography className='text-lg font-semibold text-primary-light'>
					Reason:
				</Typography>
				<Typography className=''>{appointment.reason || ''}</Typography>
			</div>
			
		</Box>
	);
};

export default AppointmentRequestDetail;
