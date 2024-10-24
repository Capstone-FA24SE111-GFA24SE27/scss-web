import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Menu, MenuItem, Paper, Radio, RadioGroup, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { useGetCounselorCounselingAppointmentQuery } from './appointments-api';
import { AppLoading, NavLinkAdapter, closeDialog, openDialog } from '@shared/components';
import { AccessTime, Add, CalendarMonth, ChevronRight, Circle, Clear, EditNote, MoreVert, Summarize } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useSocket } from '@/shared/context/socket';
import { Appointment, AppointmentAttendanceStatus } from '@/shared/types';
import { useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from '../counseling-api';

const AppointmentsContent = () => {
  const { data, isLoading, refetch } = useGetCounselorCounselingAppointmentQuery({});
  const appointments = data?.content?.data;
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const account = useAppSelector(selectAccount)

  const statusColor = {
    'DENIED': 'error',
    'WAITING': 'warning',
    'APPROVED': 'success',
    'ATTEND': 'success',
    'ABSENT': 'error',
  };

  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for the anchor element
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null); // Track selected appointment
  const navigate = useNavigate();



  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, appointment: Appointment) => {
    setOpenMenuId(openMenuId === appointment.id ? null : appointment.id); // Toggle menu
    setSelectedAppointment(appointment); // Set the clicked appointment
    setAnchorEl(event.currentTarget as HTMLElement); // Cast to HTMLElement
  };

  const handleClose = () => {
    setOpenMenuId(null);
    setAnchorEl(null);
  };

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
    return <AppLoading />;
  }
  if (!appointments?.length) {
    return <Typography color='text.secondary' variant='h5' className='p-16'>No appointments</Typography>;
  }


  return (
    <>
      <List className='flex flex-col gap-16 p-16'>
        {
          appointments.map(appointment =>
            <Paper
              key={appointment.id}
              className="flex gap-8 p-16 shadow"
              sx={{ bgcolor: 'background.paper' }}
            >
              <div className='flex flex-col w-full'>
                <div className='flex justify-between'>
                  <div className='flex gap-24'>
                    <div className='flex items-center gap-8 '>
                      <CalendarMonth />
                      <Typography className=''>{dayjs(appointment.requireDate).format('YYYY-MM-DD')}</Typography>
                    </div>
                    <div className='flex items-center gap-8'>
                      <AccessTime />
                      <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                    </div>
                  </div>
                  <div className='relative'>
                    {
                      !appointment.havingReport && ['ATTEND'].includes(appointment.status) && (
                        <div className='absolute rounded-full size-10 right-10 bg-secondary-main'></div>
                      )
                    }
                    <IconButton color='primary' onClick={(event) => handleClick(event, appointment)}>
                      <MoreVert />
                    </IconButton>
                    <Menu anchorEl={openMenuId === appointment.id ? anchorEl : null} open={openMenuId === appointment.id} onClose={handleClose} id={appointment.id.toString()}>
                      {selectedAppointment?.havingReport ? (
                        <MenuItem
                          className='w-[14rem] gap-8'
                          onClick={() => { navigate(`${selectedAppointment.id}/report`); handleClose(); }}
                        >
                          <Summarize />
                          View report
                        </MenuItem>
                      ) : (
                        <MenuItem
                          className='w-[14rem] gap-8'
                          onClick={() => { navigate(`${selectedAppointment.id}/report/create`); handleClose(); }}
                        >
                          <Add />
                          Create report
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className='flex gap-4 mb-8'>
                  {appointment.meetingType === 'ONLINE' ? (
                    <div className='flex items-center gap-24'>
                      <Chip label='Online' size='small' icon={<Circle color='success' />} className='items-center font-semibold' />
                      {appointment.meetUrl && (
                        <div>
                          <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                            Meet URL
                          </Link>
                        </div>
                      )}
                    </div>
                  ) : appointment.address && (
                    <div className='flex items-center gap-8 '>
                      <Typography className='w-60' color='textSecondary'>Address:</Typography>
                      <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                    </div>
                  )}
                  <Tooltip title={appointment.meetingType === 'ONLINE' ? 'Update meet URL' : 'Update address'}>
                    <IconButton
                      color='secondary'
                      onClick={(event) => {
                        event.stopPropagation();
                        event.preventDefault();
                        dispatch(openDialog({
                          children: <UpdateDetailsAppointmentDialog appointment={appointment} />
                        }));
                      }}
                    >
                      <EditNote fontSize='medium' />
                    </IconButton>
                  </Tooltip>
                </div>

                <div className='pl-16 border-l'>
                  <Tooltip title={`View ${appointment.studentInfo.profile.fullName}'s profile`}>
                    <ListItemButton
                      component={NavLinkAdapter}
                      to={`student/${appointment.studentInfo.profile.id}`}
                      className='w-full rounded shadow bg-primary-light/5'
                    >
                      <div className='flex items-start w-full gap-16'>
                        <Avatar
                          alt={appointment.studentInfo.profile.fullName}
                          src={appointment.studentInfo.profile.avatarLink}
                        />
                        <div>
                          <Typography className='font-semibold text-primary-main'>{appointment.studentInfo.profile.fullName}</Typography>
                          <Typography color='text.secondary'>{appointment.studentInfo.email || 'emailisnull.edu.vn'}</Typography>
                        </div>
                      </div>
                      <ChevronRight />
                    </ListItemButton>
                  </Tooltip>

                  <div className='pl-4 mt-8'>
                    {
                      ['ATTEND', 'ABSENT'].includes(appointment.status) && (
                        <div className='flex gap-4'>
                          <div className='flex items-center'>
                            <Typography className={'w-[13rem]'} color='textSecondary'>Attendance Status:</Typography>
                            <Typography className='pl-4 font-semibold' color={statusColor[appointment.status]}>
                              {appointment.status}
                            </Typography>
                          </div>
                          <Tooltip title={'Update attendance'}>
                            <IconButton
                              color='secondary'
                              onClick={() => dispatch(openDialog({
                                children: <CheckAttendanceDialog appointment={appointment} />
                              }
                              ))}
                            >
                              <EditNote fontSize='medium' />
                            </IconButton>
                          </Tooltip>
                        </div>
                      )
                    }
                    {
                      appointment.appointmentFeedback && (
                        <div className='w-full'>
                          <div className='flex'>
                            <Typography className='w-[13rem]'>Student feedback:</Typography>
                            <div className='flex flex-col'>
                              <div className='flex items-center gap-8'>
                                <Rating size='medium' value={appointment.appointmentFeedback.rating} readOnly />
                                <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                              </div>
                              <Typography className='pl-8 mt-8'>{appointment.appointmentFeedback.comment}</Typography>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    {
                      appointment.status === 'WAITING' && (
                        <div className='mt-16'>
                          <Typography className='font-semibold' color='secondary'>Do the student attend the session?</Typography>
                          <Button className='mt-4' variant='contained' color='secondary'
                            onClick={() => dispatch(openDialog({
                              children: <CheckAttendanceDialog appointment={appointment} />
                            }
                            ))}
                          >
                            Take attendance
                          </Button>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </Paper>
          )}
      </List>
    </>
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
                label={'Meet Url'}
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

export default AppointmentsContent;
