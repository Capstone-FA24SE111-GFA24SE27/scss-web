import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItem, ListItemButton, Paper, Rating, TextField, Tooltip, Typography } from '@mui/material'
import { useGetCounselingAppointmentRequestsQuery, useSendCouselingAppointmentFeedbackMutation, useGetCounselingAppointmentQuery, Appointment, useCancelCounselingAppointmentMutation } from '../activity-api'
import { AppLoading, DateRangePicker, ExpandableText, FilterTabs, ItemMenu, NavLinkAdapter, Pagination, SearchField, SortingToggle, StudentAppointmentItem, UserListItem, closeDialog, openDialog } from '@/shared/components'
import { AccessTime, CalendarMonth, ChevronRight, Circle, Clear, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useState, useEffect, ChangeEvent } from 'react'
import { useAppointmentsSocketListener, useSocket } from '@/shared/context';
import { statusColor } from '@/shared/constants';
import { openCounselorView } from '@/features/students/students-layout-slice';
const AppointmentsTab = () => {

  const socket = useSocket();
  const account = useAppSelector(selectAccount)

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [searchStudentCode, setSearchStudentCode] = useState('');

  const [tabValue, setTabValue] = useState(0);

  const [page, setPage] = useState(1);

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');


  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };


  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Canceled', value: 'CANCELED' },
    { label: 'Waiting', value: 'WAITING' },
    { label: 'Attend', value: 'ATTEND' },
    { label: 'Absent', value: 'ABSENT' },
    { label: 'Expired', value: 'EXPIRED' },
  ];

  const { data, isLoading, refetch } = useGetCounselingAppointmentQuery({
    fromDate: startDate,
    toDate: endDate,
    sortDirection: sortDirection,
    page: page,
    status: statusTabs[tabValue].value,
  });
  const appointments = data?.content?.data;

  useAppointmentsSocketListener(account?.profile.id, refetch)

  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  if (isLoading) {
    return <AppLoading />
  }

  return (
    <div className='p-16 w-full flex flex-col gap-16'>
      <Box className='flex gap-32 justify-between'>
        <DateRangePicker
          startDate={startDate ? dayjs(startDate) : null}
          endDate={endDate ? dayjs(endDate) : null}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      <FilterTabs tabs={statusTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
      <List className='flex flex-col gap-16'>
        {
          !appointments?.length
            ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointment requests</Typography>
            : appointments.map(appointment =>
              <StudentAppointmentItem appointment={appointment} key={appointment.id} />
            )}
      </List >
      <Pagination
        page={page}
        count={data?.content?.totalPages}
        handleChange={handlePageChange}
      />
    </div >
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
