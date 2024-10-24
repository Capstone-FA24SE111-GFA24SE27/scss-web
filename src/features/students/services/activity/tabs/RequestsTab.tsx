import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { AppointmentRequest, useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation } from '../activity-api'
import { AppLoading, ExpandableText, NavLinkAdapter, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch } from '@shared/store';
import { useState } from 'react'
const RequestsTab = () => {
  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({})
  const appointmentRequests = data?.content.data

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }

  if (isLoading) {
    return <AppLoading />
  }

  if (!appointmentRequests?.length) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appoitment requests</Typography>
  }

  return (
    <>
      <List className='p-16 flex flex-col gap-16'>
        {
          appointmentRequests.map(appointment =>
            <Paper
              key={appointment.id}
              className="p-16 flex gap-16 shadow"
              sx={{ bgcolor: 'background.paper' }}
            // component={NavLinkAdapter}
            // to={`appointment/${appointment.id}`}
            >
              <div className='flex flex-col gap-16 w-full justify-center'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{appointment.requireDate}</Typography>
                  </div>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{dayjs(appointment.startTime, "HH:mm:ss").format('HH:mm')} - {dayjs(appointment.endTime, "HH:mm:ss").format('HH:mm')}</Typography>
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

                </div>

                <div className='flex gap-8'>
                  <Typography className='w-52' color='textSecondary'>Reason: </Typography>
                  <ExpandableText text={appointment.reason} limit={175} />
                </div>
                <Tooltip title={`View ${appointment.counselor.profile.fullName}'s profile`}>
                  <ListItemButton
                    component={NavLinkAdapter}
                    to={`counselor/${appointment.counselor.profile.id}`}
                    className='bg-primary-light/5 w-full rounded shadow'
                  >
                    <div className='w-full flex'>
                      <Avatar
                        alt={appointment.counselor.profile.fullName}
                        src={appointment.counselor.profile.avatarLink}
                      />
                      <div className='ml-16'>
                        <Typography className='font-semibold text-primary-main'>{appointment.counselor.profile.fullName}</Typography>
                        <Typography color='text.secondary'>{appointment.counselor?.expertise?.name || appointment.counselor?.specialization?.name}</Typography>
                      </div>
                    </div>
                    <ChevronRight />
                  </ListItemButton>
                </Tooltip>
              </div>
            </Paper>
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