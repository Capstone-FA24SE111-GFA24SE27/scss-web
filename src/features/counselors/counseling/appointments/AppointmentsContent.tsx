import { ChangeEvent } from 'react'
import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Menu, MenuItem, Paper, Radio, RadioGroup, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { useCancelCounselingAppointmentCounselorMutation, useGetCounselorCounselingAppointmentQuery } from './appointments-api';
import { AppLoading, ContentLoading, CounselorAppointmentItem, DateRangePicker, ExpandableText, FilterTabs, ItemMenu, NavLinkAdapter, Pagination, SearchField, SortingToggle, UserListItem, closeDialog, openDialog } from '@shared/components';
import { AccessTime, Add, CalendarMonth, ChevronRight, Circle, Clear, EditNote, EmailOutlined, LocalPhoneOutlined, MoreVert, Summarize, Visibility } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useAppointmentsSocketListener, useSocket } from '@/shared/context';
import { Appointment, AppointmentAttendanceStatus } from '@/shared/types';
import { useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from '../counseling-api';
import { statusColor } from '@/shared/constants';
import { openStudentView } from '../../counselors-layout-slice';

const AppointmentsContent = () => {

  const dispatch = useAppDispatch();
  const socket = useSocket();
  const account = useAppSelector(selectAccount)

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for the anchor element
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // Track selected appointment
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const [searchStudentCode, setSearchStudentCode] = useState('');

  const [tabValue, setTabValue] = useState(0);

  const [page, setPage] = useState(1);

  const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Canceled', value: 'CANCELED' },
    { label: 'Waiting', value: 'WAITING' },
    { label: 'Attend', value: 'ATTEND' },
    { label: 'Absent', value: 'ABSENT' },
    { label: 'Expired', value: 'EXPIRED' },
  ];


  const handleSearchStudentCode = (searchStudentCode: string) => {
    setSearchStudentCode(searchStudentCode);
  };

  const handleStartDateChange = (date: string) => setStartDate(date);
  const handleEndDateChange = (date: string) => setEndDate(date);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event: ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };


  const { data, isFetching, isLoading, refetch } = useGetCounselorCounselingAppointmentQuery({
    fromDate: startDate,
    toDate: endDate,
    studentCode: searchStudentCode,
    sortDirection: sortDirection,
    page: page,
    status: statusTabs[tabValue].value,
  });
  const appointments = data?.content?.data;


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, appointment: Appointment) => {
    setOpenMenuId(openMenuId === appointment.id ? null : appointment.id); // Toggle menu
    setSelectedAppointment(appointment); // Set the clicked appointment
    setAnchorEl(event.currentTarget as HTMLElement); // Cast to HTMLElement
  };

  const handleClose = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };

  const handleSortChange = (newSortDirection: 'ASC' | 'DESC') => {
    setSortDirection(newSortDirection);
  };

  useAppointmentsSocketListener(account?.profile.id, refetch)


  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <div className='p-32 w-full flex flex-col gap-16 container mx-auto max-w-screen-lg'>
      <Box className='flex justify-between items-center'>
        <div className='flex gap-32'>
          <DateRangePicker
            startDate={startDate ? dayjs(startDate) : null}
            endDate={endDate ? dayjs(endDate) : null}
            onStartDateChange={handleStartDateChange}
            onEndDateChange={handleEndDateChange}
          />
          <SearchField
            onSearch={handleSearchStudentCode}
            label='Student code'
            placeholder='SE1001'
            className='!w-192 '
          />
        </div>
        <SortingToggle
          onSortChange={handleSortChange}
          initialSort='DESC'
        />
      </Box>
      <FilterTabs tabs={statusTabs} tabValue={tabValue} onChangeTab={handleChangeTab} />
      <List className='flex flex-col gap-16'>
        {
          isFetching
            ? <ContentLoading />
            : !appointments?.length
              ? <Typography color='text.secondary' variant='h5' className='p-16'>No appointments</Typography>
              // @ts-ignored
              : appointments.map(appointment => <CounselorAppointmentItem appointment={appointment} />
              )}
      </List>
      <Pagination
        page={page}
        count={data?.content?.totalPages}
        handleChange={handlePageChange}
      />
    </div >
  );
}

const UpdateDetailsAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  const [updateAppointmentDetails] = useUpdateAppointmentDetailsMutation();
  const [meetUrl, setMeetUrl] = useState(appointment.meetUrl);
  const [address, setAddress] = useState(appointment.address);
  const dispatch = useAppDispatch();

  const handleEditDetails = () => {
    const meetingDetails = {};
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl;
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      });
    } else {
      meetingDetails['address'] = address;
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails
      });
    }
    dispatch(closeDialog());
  }

  return (
    <div className='w-[40rem]'>
      <DialogTitle id="alert-dialog-title">Edit details?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {appointment.meetingType === 'ONLINE' ? (
              <Typography>Edit the current meeting URL</Typography>
            ) : (
              <Typography>Edit the current address</Typography>
            )}
          </div>
          <div>
            {appointment.meetingType === 'ONLINE' ? (
              <TextField
                autoFocus
                margin="dense"
                name={'meetUrl'}
                label={'Meeting Url'}
                fullWidth
                value={meetUrl}
                variant="standard"
                className='mt-16'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setMeetUrl(event.target.value);
                }} />
            ) : (
              <TextField
                autoFocus
                margin="dense"
                name={'address'}
                label={'Address'}
                fullWidth
                value={address}
                variant="standard"
                className='mt-16'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.target.value);
                }} />
            )}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => handleEditDetails()}
          color="secondary" variant='contained'
          disabled={!meetUrl && !address}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}

const CheckAttendanceDialog = ({ appointment }: { appointment: Appointment }) => {
  const dispatch = useAppDispatch();
  const [attendanceStatus, setAttendanceStatus] = useState<AppointmentAttendanceStatus>((appointment.status as AppointmentAttendanceStatus) || 'WAITING');
  const [takeAttendance] = useTakeAppointmentAttendanceMutation();

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAttendanceStatus((event.target as HTMLInputElement).value as AppointmentAttendanceStatus);
  }

  const handleTakeAttendance = () => {
    takeAttendance({
      appointmentId: appointment.id,
      counselingAppointmentStatus: attendanceStatus as AppointmentAttendanceStatus
    });
    dispatch(closeDialog());
  }

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Update attendance for this student</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className='flex flex-col gap-16'>
          <div className='flex justify-start gap-16 rounded'>
            <Avatar
              alt={appointment.studentInfo.profile.fullName}
              src={appointment.studentInfo.profile.avatarLink}
            />
            <div>
              <Typography className='font-semibold text-primary-main'>{appointment.studentInfo.profile.fullName}</Typography>
              <Typography color='text.secondary'>{appointment.studentInfo.email || 'counselor@fpt.edu.vn'}</Typography>
            </div>
          </div>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              value={attendanceStatus}
              onChange={handleRadioChange}
            >
              <div className='flex gap-16'>
                <FormControlLabel value="ATTEND" control={<Radio color='success' />} label="Attended" className='text-black' />
                <FormControlLabel value="ABSENT" control={<Radio color='error' />} label="Absent" className='text-black' />
                <Tooltip title='Clear selection'>
                  <IconButton onClick={() => setAttendanceStatus('WAITING')}>
                    <Clear />
                  </IconButton>
                </Tooltip>
              </div>
            </RadioGroup>
          </FormControl>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dispatch(closeDialog())} color="primary">
          Cancel
        </Button>
        <Button onClick={handleTakeAttendance} color="secondary" variant='contained'>
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}

const CancelAppointmentDialog = ({ appointment }: { appointment: Appointment }) => {
  const [cancelAppointment, { isLoading }] = useCancelCounselingAppointmentCounselorMutation();
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

export default AppointmentsContent;
