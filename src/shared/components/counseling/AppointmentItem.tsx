import { openCounselorView } from '@/features/students/students-layout-slice';
import { ExpandableText, ItemMenu, UserListItem, closeDialog, openDialog } from '@/shared/components';
import { statusColor } from '@/shared/constants';
import { Appointment } from '@/shared/types';
import { useCancelCounselingAppointmentMutation, useSendCouselingAppointmentFeedbackMutation } from '@features/students/services/activity/activity-api';
import { AccessTime, CalendarMonth, Circle, Clear, Visibility } from '@mui/icons-material';
import { Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
const AppointmentItem = ({ appointment }: { appointment: Appointment }) => {

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  if (!appointment) {
    return
  }

  return (
    <Paper
      key={appointment.id}
      className="p-16 flex gap-16 shadow"
      sx={{ bgcolor: 'background.paper' }}
    >
      <div className='flex flex-col gap-16 w-full'>
        <ListItem className='flex gap-24 p-0'
        >
          <div className='flex gap-8 items-center'>
            <CalendarMonth />
            <Typography className='' >{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
          </div>
          <div className='flex gap-8 items-center'>
            <AccessTime />
            <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
          </div>
          <Chip
            label={appointment.meetingType == 'ONLINE' ? 'Online' : 'Offline'}
            icon={<Circle color={appointment.meetingType == 'ONLINE' ? 'success' : 'disabled'} />}
            className='font-semibold items-center'
            size='small'
          />
          <Chip
            label={appointment.status}
            variant='filled'
            color={statusColor[appointment.status]}
            size='small'
          />
        </ListItem>
        <div className='flex gap-4'>
          {appointment.meetingType === 'ONLINE' ? (
            <div className='flex items-center gap-24'>
              {appointment.meetUrl && (
                <div className='flex items-center gap-8'>
                  <Typography className='w-60' color='textSecondary'>Location:</Typography>
                  <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                    {appointment.meetUrl}
                  </Link>
                </div>
              )}
            </div>
          ) : appointment.address && (
            <div className='flex items-center gap-8'>
              <Typography className='w-60' color='textSecondary'>Address:</Typography>
              <Typography className='font-semibold'>{appointment.address || ''}</Typography>
            </div>
          )}
        </div>
        <div className='flex flex-col gap-16'>
          <Typography className='text-lg font-semibold text-primary-light'>Counselor:</Typography>
          <ListItemButton
            className='bg-primary-light/5 flex-1 rounded shadow'
          >
            <UserListItem
              fullName={appointment.counselorInfo.profile.fullName}
              avatarLink={appointment.counselorInfo.profile.avatarLink}
              phoneNumber={appointment.counselorInfo.profile.phoneNumber}
              email={appointment.counselorInfo.email}
            />
          </ListItemButton>
          <Typography className='text-lg font-semibold text-primary-light'>Counselee:</Typography>

          <ListItemButton
            className='bg-primary-light/5 flex-1 rounded shadow'
          >
            <UserListItem
              fullName={appointment.studentInfo.profile.fullName}
              avatarLink={appointment.studentInfo.profile.avatarLink}
              phoneNumber={appointment.studentInfo.profile.phoneNumber}
              email={appointment.studentInfo.email}
            />
          </ListItemButton>
        </div>

      </div>
    </Paper>
  )
}


export default AppointmentItem

