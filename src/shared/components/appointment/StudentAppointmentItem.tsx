import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation, useGetCounselingAppointmentQuery, Appointment, useCancelCounselingAppointmentMutation } from '@features/students/services/activity/activity-api'
import { AppLoading, DateRangePicker, ExpandableText, FilterTabs, ItemMenu, NavLinkAdapter, Pagination, SearchField, SortingToggle, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle, Clear, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useState, useEffect, ChangeEvent } from 'react'
import { useSocket } from '@/shared/context';
import { statusColor } from '@/shared/constants';
import { openCounselorView } from '@/features/students/students-layout-slice';
const AppointmentsTab = ({ appointment }: { appointment: Appointment }) => {

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
          secondaryAction={
            <ItemMenu
              menuItems={[
                {
                  label: 'Cancel',
                  onClick: () => {
                    dispatch(
                      openDialog({
                        children: <CancelAppointmentDialog appointment={appointment} />
                      })
                    )
                  },
                  icon: <Clear fontSize='small' />,
                  disabled: ![`WAITING`].includes(appointment.status)
                },
                {
                  label: 'View details',
                  onClick: () => {
                    navigate(`appointment/${appointment.id}`)
                  },
                  icon: <Visibility fontSize='small' />
                },
              ]}
            />
          }
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

        {/* {
                    appointment.meetingType === 'OFFLINE' && appointment.address && (<div className='flex gap-16 items-center'>
                      <Typography className='w-68' color='textSecondary'>Address:</Typography>
                      <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                    </div>)
                  } */}
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
        <Tooltip title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}>
          <ListItemButton
            // component={NavLinkAdapter}
            // to={`counselor/${appointment.counselorInfo.profile.id}`}
            onClick={() => {
              dispatch(openCounselorView(appointment.counselorInfo.profile.id.toString()))
            }}
            className='bg-primary-light/5 flex-1 rounded shadow'
          >
            <UserListItem
              fullName={appointment.counselorInfo.profile.fullName}
              avatarLink={appointment.counselorInfo.profile.avatarLink}
              phoneNumber={appointment.counselorInfo.profile.phoneNumber}
              email={appointment.counselorInfo.email}
            />
            {/* <ChevronRight /> */}
          </ListItemButton>
        </Tooltip>
        {appointment.appointmentFeedback ?
          <div className='w-full'>
            <Divider className='border' />
            <div className='flex items-start gap-16 mt-8'>
              <Typography color='textSecondary' className='w-96 pt-2'>Your feedback:</Typography>
              <div className='flex-1'>
                <div>
                  <div className='flex items-center gap-8'>
                    <Rating
                      size='medium'
                      value={appointment.appointmentFeedback.rating}
                      readOnly
                    />
                    <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                  </div>
                </div>
                <ExpandableText className='pl-8 mt-8' text={appointment.appointmentFeedback.comment} limit={96} />
                {/* <Typography className='pl-8 mt-8' sx={{ color: 'text.secondary' }}>{appointment.appointmentFeedback.comment}</Typography> */}
              </div>
            </div>
          </div>
          : appointment.status === 'ATTEND' && <>
            <div className='flex flex-col w-full gap-4 text-secondary-main '>
              <Divider />
              {/* <Typography className='font-semibold'>Send feedback about the appointment!</Typography> */}
              <div className='flex'>
                <Button
                  // variant='outlined'
                  size='large'
                  onClick={() => dispatch(openDialog({
                    children: (
                      <SendFeedbackDialog appointment={appointment} />
                    )
                  }))}
                >
                  Leave a review
                </Button>
              </div>
            </div>

          </>
        }
      </div>
    </Paper>
  )
}


const SendFeedbackDialog = ({ appointment }: { appointment: Appointment }) => {
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const dispatch = useAppDispatch()
  const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation()
  const handleSendFeedback = () => {
    sendFeedback({
      appointmentId: appointment.id,
      feedback: {
        comment,
        rating
      }
    })
    dispatch(closeDialog())
  }

  return (
    <div className='w-[50rem]'>
      <DialogTitle id="alert-dialog-title">Review the counseling session?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Give a feedback for counselor</Typography>
          <TextField
            autoFocus
            margin="dense"
            name={'comment'}
            label={'Comment'}
            fullWidth
            multiline
            rows={4}
            maxRows={4}

            value={comment}
            className='mt-16'
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setComment(event.target.value);
            }} />
          <div className='mt-16'>
            <Typography component="legend">Rate this session</Typography>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newRating) => {
                setRating(newRating);
              }}
            />
          </div>

        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())}
          color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleSendFeedback()}
          color="secondary" variant='contained'
          disabled={!comment || !rating}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}

export default AppointmentsTab

const CancelAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  const [cancelAppointment, { isLoading }] = useCancelCounselingAppointmentMutation();
  const [cancelReason, setCancelReasonl] = useState(``);
  const dispatch = useAppDispatch();
  const handleCancelAppointment = () => {
    cancelAppointment({
      appointmentId: appointment.id,
      reason: cancelReason
    }).unwrap()
      .then(() => {
        dispatch(closeDialog())
      })

  }
  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Confirm cancelling appointment?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            Give the reason for cancelling
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              name={'Cancel reason'}
              label={'Cancel reason'}
              fullWidth
              value={cancelReason}
              variant="standard"
              className='mt-16'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setCancelReasonl(event.target.value);
              }} />
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())} color="primary">
          Cancel
        </Button>
        <Button
          onClick={handleCancelAppointment}
          color="secondary" variant='contained'
          disabled={!cancelReason || isLoading}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}
