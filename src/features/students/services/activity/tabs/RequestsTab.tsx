import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { AppointmentRequest, useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation } from '../activity-api'
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch } from '@shared/store';
import { useState } from 'react'
const RequestsTab = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})
  const appointmentRequests = data?.content.data
  console.log(data)

  if (isLoading) {
    return <AppLoading />
  }
  if (!appointmentRequests) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appoitment requests</Typography>
  }

  console.log(appointmentRequests)

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }

  const dispatch = useAppDispatch()

  return (
    <>
      <List>
        {
          appointmentRequests.map(appointment =>
            <ListItem
              key={appointment.id}
              className="p-16 flex gap-16"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{dayjs(appointment.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointment.endTime, "HH:mm:ss").format('HH:mm')}</Typography>
                  </div>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{appointment.requireDate}</Typography>
                  </div>
                </div>
                <div className='flex gap-4'>
                  {
                    appointment.meetingType === 'ONLINE' ?
                      <div className='flex gap-24 items-center'>
                        <Chip
                          label='Online'
                          icon={<Circle color='success' />}
                          className='font-semibold  items-center'
                        />
                        {appointment.appointmentDetails?.meetUrl && (
                          <div>
                            <Link to={appointment.appointmentDetails?.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                              Meet URL
                            </Link>
                          </div>
                        )}
                      </div>
                      : appointment.appointmentDetails?.address && (<div className='flex gap-8 items-center '>
                        <Typography className='w-60'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.appointmentDetails?.address || ''}</Typography>
                      </div>)
                  }
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-52'>Status:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                <div className='flex gap-8'>
                  <Typography className='w-52'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div>
                <Tooltip title={`View ${appointment.counselor.profile.fullName}'s profile`}>
                  <ListItem
                    component={NavLinkAdapter}
                    to={`/services/counseling/${appointment.counselor.profile.id}`}
                    className='bg-primary-main/10 w-full'
                  >
                    <Avatar
                      alt={appointment.counselor.profile.fullName}
                      src={appointment.counselor.profile.avatarLink}
                    />
                    <div className='ml-16'>
                      <Typography className='font-semibold text-primary-main'>{appointment.counselor.profile.fullName}</Typography>
                      <Typography color='text.secondary'>{appointment.counselor.email || 'counselor@fpt.edu.vn'}</Typography>
                    </div>
                  </ListItem>
                </Tooltip>
              </div>
            </ListItem>
          )}
      </List >
    </>
  )
}


const SendFeedbackDialog = ({ appointment }: { appointment: AppointmentRequest }) => {
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
    <div className='w-[40rem]'>
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
            value={comment}
            variant="standard"
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
          disabled={!comment && !rating}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  )
}
export default RequestsTab