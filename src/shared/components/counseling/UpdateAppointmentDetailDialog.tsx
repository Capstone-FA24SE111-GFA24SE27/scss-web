import { Appointment } from '@/shared/types';
import { validateUrl } from '@/shared/utils';
import { useUpdateAppointmentDetailsMutation } from '@features/counselors/counseling';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { closeDialog, setBackdropLoading } from '@shared/components';
import { useAppDispatch } from '@shared/store';
import { useEffect, useState } from 'react';

// Regex for validating a URL

type AppointmentPropsItem = {
  appointment: Appointment;
  handleCloseDialog?: () => void;
  openDetail?: boolean;
};

const UpdateAppointmentDetailDialog = ({
  appointment,
  handleCloseDialog = () => { },
}: AppointmentPropsItem) => {
  const [updateAppointmentDetails, { isLoading, isSuccess }] =
    useUpdateAppointmentDetailsMutation();
  const [meetUrl, setMeetUrl] = useState(appointment.meetUrl);
  const [address, setAddress] = useState(appointment.address);
  const [isMeetUrlValid, setIsMeetUrlValid] = useState(true); // Track URL validity
  const dispatch = useAppDispatch();

  const handleEditDetails = () => {
    const meetingDetails = {};
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl;
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails,
      });
    } else {
      meetingDetails['address'] = address;
      updateAppointmentDetails({
        requestId: appointment.id,
        meetingDetails,
      });
    }
    handleCloseDialog();
  };

  if (isSuccess) {
    dispatch(closeDialog());
  }

  useEffect(() => {
    dispatch(setBackdropLoading(isLoading));
  }, [isLoading]);

  const handleMeetUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setMeetUrl(url);
    setIsMeetUrlValid(validateUrl(url)); // Update URL validity
  };

  return (
    <div className="w-[40rem]">
      <DialogTitle id="alert-dialog-title">Edit appointment details?</DialogTitle>
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
                className="mt-16"
                onChange={handleMeetUrlChange}
                error={!isMeetUrlValid} // Show error if URL is invalid
                helperText={!isMeetUrlValid ? 'Invalid URL format' : ''} // Display error message
              />
            ) : (
              <TextField
                autoFocus
                margin="dense"
                name={'address'}
                label={'Address'}
                fullWidth
                value={address}
                variant="standard"
                className="mt-16"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.target.value);
                }}
              />
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
          color="secondary"
          variant="contained"
          disabled={
            (appointment.meetingType === 'ONLINE') ||
            (!meetUrl && !address) ||
            isLoading
          }
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
};

export default UpdateAppointmentDetailDialog;
