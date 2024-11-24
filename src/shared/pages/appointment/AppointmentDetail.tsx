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
  Typography
} from '@mui/material';
import { AccessTime, Add, CalendarMonth, Circle, Clear, EditNote, Summarize } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useGetAppointmentByIdQuery } from './appointment-api';
import { AppLoading, AppointmentReport, ContentLoading, UserLabel, UserListItem } from '@/shared/components';
import { useAppDispatch } from '@shared/store';

const AppointmentDetail = ({ id }: { id?: string }) => {
  const { id: appointmentRouteId } = useParams();
  const appointmentId = id || appointmentRouteId
  const { data: appointmentData, isLoading } = useGetAppointmentByIdQuery(appointmentId)
  const appointment = appointmentData?.content;
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(null);

  const dispatch = useAppDispatch()
  // Appointment status color
  const statusColor = {
    ATTEND: 'success',
    ABSENT: 'error',
    WAITING: 'warning',
    CANCELED: 'default',
  };

  if (isLoading) {
    return <ContentLoading />
  }

  if (!appointment) {
    return <Typography variant='h5' color='textSecondary'>No appointment</Typography>
  }

  return (
    <Box className={`p-36 flex flex-col gap-16 max-w-md -mt-8`}>
      <Typography className="font-extrabold leading-none tracking-tight text-20 md:text-24">
        Appointment Details
      </Typography>
      <div className="flex gap-24 pb-8">
        <div className='flex gap-24 items-center'>
          <div className='flex items-center gap-8 '>
            <CalendarMonth />
            <Typography className=''>{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
          </div>
          <div className='flex items-center gap-8'>
            <AccessTime />
            <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
          </div>
          <Chip
            label={appointment.meetingType == 'ONLINE' ? 'Online' : 'Offline'}
            icon={<Circle color={appointment.meetingType == 'ONLINE' ? 'success' : 'disabled'} />}
            className='font-semibold items-center'
            size='small'
          />
          {
            ['CANCELED'].includes(appointment?.status) && <Chip
              label={appointment.status}
              variant='filled'
              color={statusColor[appointment.status]}
              size='small'
            />
          }
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
          <Typography className="text-lg font-semibold text-primary-light">
            Counselee
          </Typography>
          <div
            className='flex justify-start gap-16 rounded'
          >

            <UserListItem
              fullName={appointment.studentInfo.profile.fullName}
              avatarLink={appointment.studentInfo.profile.avatarLink}
              phoneNumber={appointment.studentInfo.profile.phoneNumber}
              email={appointment.studentInfo.email}
            />
          </div>
        </div>
        <div className='flex flex-col flex-1 gap-8 rounded'>
          <Typography className="text-lg font-semibold text-primary-light">
            Counselor
          </Typography>
          <div
            className='flex justify-start gap-16 rounded'
          >

            <UserListItem
              fullName={appointment.counselorInfo.profile.fullName}
              avatarLink={appointment.counselorInfo.profile.avatarLink}
              phoneNumber={appointment.counselorInfo.profile.phoneNumber}
              email={appointment.counselorInfo.email}
            />
          </div>
        </div>
      </div>

      <Divider />

      <div className='flex gap-4 mb-8 '>
        {appointment.meetingType === 'ONLINE' ? (
          <div className='flex items-center gap-24'>
            {appointment.meetUrl && (
              <div className='flex flex-col items-center gap-8'>
                <Typography className='text-lg font-semibold text-primary-light'>Location:</Typography>
                <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline -ml-32'>
                  {appointment.meetUrl}
                </Link>
              </div>
            )}
          </div>
        ) : appointment.address && (
          <div className='flex flex-col items-center gap-8'>
            <Typography className='text-lg font-semibold text-primary-light'>Address:</Typography>
            <Typography className='font-semibold -ml-32'>{appointment.address || ''}</Typography>
          </div>
        )}
      </div>

      <Divider />

      <div className='flex flex-col gap-8'>
        <Typography className='text-lg font-semibold text-primary-light'>Reason:</Typography>
        <Typography className=''>
          {appointment.reason || ''}
        </Typography>
      </div>
      {
        appointment.appointmentFeedback && <div className='flex flex-col items-start gap-8 mt-8'>
          <Typography className='text-lg font-semibold text-primary-light'>Feedback:</Typography>
          <div className='flex-1'>
            <div className='flex-1'>
              <div className='flex items-center gap-8'>
                <Rating
                  size='medium'
                  value={appointment.appointmentFeedback.rating}
                  readOnly
                />
                <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
              </div>
            </div>
            <Typography className='pl-8 mt-8' sx={{ color: 'text.secondary' }}>{appointment.appointmentFeedback.comment}</Typography>
          </div>
        </div>
      }
    </Box>
  );
};

export default AppointmentDetail;
