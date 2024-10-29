import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { AppointmentRequest, useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation } from '../activity-api'
import { AppLoading, DateRangePicker, ExpandableText, NavLinkAdapter, Pagination, SelectField, SortingToggle, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppDispatch } from '@shared/store';
import { ChangeEvent, useState } from 'react'
const RequestsTab = () => {
  const [page, setPage] = useState(1);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [selectedMeetingType, setSelectedMeetingType] = useState('');

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');



  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSelectMeetingType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedMeetingType(event.target.value);
  };

  const meetingTypeOptions = [
    { label: 'Online', value: 'ONLINE' },
    { label: 'Offline', value: 'OFFLINE' },
  ]

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);


  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  const { data, isLoading } = useGetCounselingAppointmentRequestsQuery({
    dateFrom: startDate,
    dateTo: endDate,
    meetingType: selectedMeetingType as `ONLINE` | `OFFLINE` | ``,
    page: page,
    sortDirection: sortDirection
  })

  const appointmentRequests = data?.content.data

  const statusColor = {
    'REJECTED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success'
  }

  if (isLoading) {
    return <AppLoading />
  }
  return (
    <div className='p-16'>
      <Box className='flex justify-between'>
        <div className='flex gap-32'>
          <DateRangePicker
            startDate={startDate ? dayjs(startDate) : null}
            endDate={endDate ? dayjs(endDate) : null}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
          <SelectField
            label="Meting type"
            options={meetingTypeOptions}
            value={selectedMeetingType}
            onChange={handleSelectMeetingType}
            className='w-192'
            showClearOptions
          />
        </div>
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      <List className='flex flex-col gap-16 mt-8'>
        {
          !appointmentRequests?.length
            ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
            : appointmentRequests.map(appointment =>
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
                      <UserListItem
                        fullName={appointment.counselor.profile.fullName}
                        avatarLink={appointment.counselor.profile.avatarLink}
                        phoneNumber={appointment.counselor.profile.phoneNumber}
                        email={appointment.counselor.email}
                      />
                      <ChevronRight />
                    </ListItemButton>
                  </Tooltip>
                </div>
              </Paper>
            )}
      </List >
      <Pagination
        page={page}
        count={data?.content.totalPages}
        handleChange={handlePageChange}
      />
    </div>
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