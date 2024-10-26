import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation, useGetCounselingAppointmentQuery, Appointment } from '../activity-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useState, useEffect } from 'react'
import { useSocket } from '@/shared/context';
const AppointmentsTab = () => {
  const { data, isLoading, refetch } = useGetCounselingAppointmentQuery({})
  const appointmentRequests = data?.content.data
  const socket = useSocket();
  const account = useAppSelector(selectAccount)

  const statusColor = {
    'REJECTED': 'error',
    'ABSENT': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success',
    'ATTEND': 'success'
  }

  const dispatch = useAppDispatch()

  useEffect(() => {

    const cb = (data: unknown) => {
      if (data) {
        refetch()
      }

    };

    if (socket && account) {
      socket.on(`/user/${account.profile.id}/appointment`, cb);
    }

    return () => {
      if (socket && account) {
        socket.off(`/user/${account.profile.id}/appointment`, cb);
      }
    };
  }, [socket]);

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests?.length) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
  }

  return (
    <>
      <List className='flex flex-col gap-16'>
        {
          appointmentRequests.map(appointment =>
            <Paper
              key={appointment.id}
              className="p-16 flex gap-16 shadow"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{dayjs(appointment.requireDate).format('YYYY-MM-DD')}</Typography>
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
                  {
                    appointment.meetingType === 'ONLINE' && <div className='flex gap-24  items-center'>
                      {appointment.meetUrl && (
                        <div>
                          <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                            Meet URL
                          </Link>
                        </div>
                      )}
                    </div>
                  }

                </div>

                {
                  appointment.meetingType === 'OFFLINE' && appointment.address && (<div className='flex gap-16 items-center'>
                    <Typography className='w-68' color='textSecondary'>Address:</Typography>
                    <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                  </div>)
                }

                <div className='flex gap-16'>
                  <Typography className='w-68' color='textSecondary'>Attendance:</Typography>
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
                <Tooltip title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}>
                  <ListItemButton
                    component={NavLinkAdapter}
                    to={`counselor/${appointment.counselorInfo.profile.id}`}
                    className='bg-primary-light/5 w-full rounded shadow'
                  >
                    <div className='w-full flex'>
                      <Avatar
                        alt={appointment.counselorInfo.profile.fullName}
                        src={appointment.counselorInfo.profile.avatarLink}
                      />
                      <div className='ml-16'>
                        <Typography className='font-semibold text-primary-main'>{appointment.counselorInfo.profile.fullName}</Typography>
                        <Typography color='text.secondary'>{appointment.counselorInfo?.expertise?.name || appointment.counselorInfo?.specialization?.name}</Typography>
                      </div>
                    </div>
                    <ChevronRight />
                  </ListItemButton>
                </Tooltip>
                {appointment.appointmentFeedback ?
                  <div className='w-full'>
                    <Divider className='border' />
                    <div className='flex items-start gap-16 mt-16'>
                      <Typography className='w-96'>Your feedback:</Typography>
                      <div>
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
                        <Typography className='pl-8 mt-8' sx={{ color: 'text.secondary' }}>{appointment.appointmentFeedback.comment}</Typography>
                      </div>
                    </div>
                  </div>
                  : appointment.status === 'ATTEND' && <>
                    <div className='flex flex-col w-full  gap-8 text-secondary-main '>
                      <Divider />
                      {/* <Typography className='font-semibold'>Send feedback about the appointment!</Typography> */}
                      <div className='flex '>
                        <Button
                          // variant='outlined'
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
          )}
      </List >
    </>
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
      <DialogTitle id="alert-dialog-title">Edit details?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <Typography>Edit the current meeting URL</Typography>
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