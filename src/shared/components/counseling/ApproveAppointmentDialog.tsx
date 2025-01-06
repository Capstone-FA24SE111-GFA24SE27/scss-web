import { closeDialog } from '@/shared/components';
import { useAlertDialog } from '@/shared/hooks';
import { AppointmentRequest } from '@/shared/types';
import { validateUrl } from '@/shared/utils';
import { useApproveAppointmentRequestOfflineMutation, useApproveAppointmentRequestOnlineMutation } from '@features/counselors/counseling/counseling-api';
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { useAppDispatch } from '@shared/store';
import { useState } from 'react';

// Regex for validating a URL
const ApproveAppointmentDialog = ({ appointment }: { appointment: AppointmentRequest }) => {
  const [approveAppointmentRequestOnline, { isLoading: isLoadingOnline }] = useApproveAppointmentRequestOnlineMutation();
  const [approveAppointmentRequestOffline, { isLoading: isLoadingOffline }] = useApproveAppointmentRequestOfflineMutation();
  const [meetUrl, setMeetUrl] = useState('');
  const [address, setAddress] = useState('');
  const [isMeetUrlValid, setIsMeetUrlValid] = useState(true); // State to track URL validity
  const dispatch = useAppDispatch();

  const handleApproveRequest = () => {
    const meetingDetails = {};
    if (appointment.meetingType === 'ONLINE') {
      meetingDetails['meetUrl'] = meetUrl;
      approveAppointmentRequestOnline({
        requestId: appointment.id,
        meetingDetails,
      })
        .unwrap()
        .then(() => {
          dispatch(closeDialog());
          useAlertDialog({
            dispatch,
            title: 'Request Approved',
          });
        })
        .catch(() => {
          useAlertDialog({
            dispatch,
            title: 'Error approving request',
          });
        });
    } else {
      meetingDetails['address'] = address;
      approveAppointmentRequestOffline({
        requestId: appointment.id,
        meetingDetails,
      })
        .unwrap()
        .then(() => {
          dispatch(closeDialog());
          useAlertDialog({
            dispatch,
            title: 'Request Approved',
          });
        })
        .catch(() => {
          useAlertDialog({
            dispatch,
            title: 'Error approving request',
          });
        });
    }
  };

  // Handle URL validation when the user types
  const handleMeetUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setMeetUrl(url);
    setIsMeetUrlValid(validateUrl(url));
  };

  return (
    <div>
      <DialogTitle id="alert-dialog-title">Approve this appointment request?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div>
            {appointment.meetingType === 'ONLINE' ? (
              <div>
                <Typography>The counseling appointment will be conducted ONLINE.</Typography>
                <Typography>Please enter your meet URL.</Typography>
              </div>
            ) : (
              <div>
                <Typography>The counseling appointment will be conducted OFFLINE.</Typography>
                <Typography>Please enter your address.</Typography>
              </div>
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
                helperText={!isMeetUrlValid ? 'Invalid URL' : ''} // Display error message
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
          onClick={() => handleApproveRequest()}
          color="secondary"
          variant="contained"
          disabled={
            (!meetUrl && !address) ||
            isLoadingOnline ||
            isLoadingOffline
          }
        >
          Confirm
        </Button>
      </DialogActions>
    </div>
  );
};

export default ApproveAppointmentDialog;
