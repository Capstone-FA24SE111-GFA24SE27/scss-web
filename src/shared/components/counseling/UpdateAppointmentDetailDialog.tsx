import { Appointment, AppointmentAttendanceStatus } from '@/shared/types';
import { useTakeAppointmentAttendanceMutation, useUpdateAppointmentDetailsMutation } from '@features/counselors/counseling';
import { useCancelCounselingAppointmentCounselorMutation } from '@features/counselors/counseling/appointments/appointments-api';
import { Clear } from '@mui/icons-material';
import { Avatar, Button, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, IconButton, Radio, RadioGroup, TextField, Tooltip, Typography } from '@mui/material';
import { closeDialog, setBackdropLoading } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import { useEffect, useState } from 'react';


type AppointmentPropsItem = {
  appointment: Appointment,
  handleCloseDialog?: () => void,
  openDetail?: boolean,
}

const UpdateAppointmentDetailDialog = ({ appointment, handleCloseDialog = () => { } }: AppointmentPropsItem) => {
  const [updateAppointmentDetails, { isLoading, isSuccess }] = useUpdateAppointmentDetailsMutation();
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
    handleCloseDialog()
  }
  if (isSuccess) {
    dispatch(closeDialog());
  }
  useEffect(() => {
    dispatch(setBackdropLoading(isLoading))
  }, [isLoading]);

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

const CheckAttendanceDialog = ({ appointment, handleCloseDialog = () => { } }: AppointmentPropsItem) => {
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
    handleCloseDialog()
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
              <div className='flex justify-between gap-16 '>
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
        <Button
          onClick={handleTakeAttendance}
          color="secondary"
          variant='contained'
          disabled={appointment.status === attendanceStatus}
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
}

const CancelAppointmentDialog = ({ appointment, handleCloseDialog = () => { } }: AppointmentPropsItem) => {
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
        handleCloseDialog()
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

export default UpdateAppointmentDetailDialog;
