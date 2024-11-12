import { ChangeEvent } from 'react'
import { Avatar, Box, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, IconButton, List, ListItem, ListItemButton, Menu, MenuItem, Paper, Radio, RadioGroup, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { useCancelCounselingAppointmentCounselorMutation, useGetCounselorCounselingAppointmentQuery } from '@features/counselors/counseling/appointments/appointments-api';
import { AppLoading, DateRangePicker, FilterTabs, ItemMenu, NavLinkAdapter, Pagination, SearchField, SortingToggle, UserListItem, closeDialog, openDialog } from '@shared/components';
import { AccessTime, Add, CalendarMonth, ChevronRight, Circle, Clear, EditNote, EmailOutlined, LocalPhoneOutlined, MoreVert, Summarize } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import dayjs from 'dayjs';
import { useSocket } from '@/shared/context';
import { Appointment, AppointmentAttendanceStatus } from '@/shared/types';
import { useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from '@features/counselors/counseling';
import { statusColor } from '@/shared/constants';
import { openStudentView } from '@/features/counselors/counselors-layout-slice';

const CounselorAppointmentItem = ({ appointment }: { appointment: Appointment }) => {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  return (
    <div
      className="flex gap-8 p-16"
    >
      <div className='flex flex-col w-full'>
        <ListItem
          className='flex justify-between p-0'
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
                  icon: <Clear fontSize='small' />
                },
                ...(['ATTEND'].includes(appointment?.status) ? [
                  appointment?.havingReport
                    ? {
                      label: 'View Report',
                      onClick: () => { navigate(`${appointment?.id}/report`) },
                      icon: <Summarize fontSize='small' />
                    }
                    : {
                      label: 'Create Report',
                      onClick: () => { navigate(`${appointment?.id}/report/create`) },
                      icon: <Add fontSize='small' />
                    }
                ] : [])
              ]}
            />
          }
        >
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
          </div>
          {/* <div className='relative'>
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
        </div> */}
        </ListItem>
        <div className='flex gap-4 mb-8'>
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

        <div className='pl-16 border-l-2'>
          <Tooltip title={`View ${appointment.studentInfo.profile.fullName}'s profile`}>
            <ListItemButton
              onClick={() => dispatch(openStudentView(appointment.studentInfo.id.toString()))}
              className='w-full rounded shadow bg-primary-light/5'
            >
              <UserListItem
                fullName={appointment.studentInfo.profile.fullName}
                avatarLink={appointment.studentInfo.profile.avatarLink}
                phoneNumber={appointment.studentInfo.profile.phoneNumber}
                email={appointment.studentInfo.email}
              />
              {/* <ChevronRight /> */}
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
                      onClick={() => dispatch(
                        openDialog({
                          children: <CheckAttendanceDialog appointment={appointment} />
                        })
                      )}
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
    </div>
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

export default CounselorAppointmentItem;
