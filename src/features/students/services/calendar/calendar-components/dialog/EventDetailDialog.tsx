import { useAppDispatch, useAppSelector } from '@shared/store';
import React, { useState } from 'react';
import { closeDayDetailDialog, closeEventDetailDialog, selectEventDialog } from '../../calendar-slice';
import { Avatar, Button, Chip, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, ListItemButton, Popover, Rating, TextField, Tooltip, Typography } from '@mui/material';
import { AccessTime, CalendarMonth, ChevronRight, Circle } from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { closeDialog, NavLinkAdapter, openDialog } from '@/shared/components';
import { Appointment, useSendCouselingAppointmentFeedbackMutation } from '../../../activity/activity-api';
import { DeepPartial } from 'react-hook-form';
import { AppointmentScheduleType } from '../../calendar-api';


const EventDetailDialog = () => {
    const dispatch = useAppDispatch();
	const eventDialog = useAppSelector(selectEventDialog);


    /**
	 * Close Dialog
	 */
    function closeDialog() {
		return dispatch(closeEventDetailDialog())
	}

    if(eventDialog.type !== 'event'){
        return null
    }

    if(eventDialog.data === null){
        return null
    }

	const appointment = eventDialog.data[0]

	const statusColor = {
		'REJECTED': 'error',
		'ABSENT': 'error',
		'WAITING': 'warning',
		'APPROVED': 'success',
		'ATTEND': 'success'
	  }

	return (
		<Popover
			{...eventDialog.props}
			open={eventDialog.props.open}
			anchorReference='anchorPosition'
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left',
			}}
			onClose={closeDialog}
			component='div'
		>
			<div className='flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480 '>
			<div className='flex flex-col gap-16 w-full'>
                <div className='flex gap-24'>
                  <div className='flex gap-8 items-center'>
                    <AccessTime />
                    <Typography className=''>{dayjs(appointment.startDateTime).format('HH:mm')} - {dayjs(appointment.endDateTime).format('HH:mm')}</Typography>
                  </div>
                  <div className='flex gap-8 items-center '>
                    <CalendarMonth />
                    <Typography className='' >{dayjs(appointment.startDateTime).format('YYYY-MM-DD')}</Typography>
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
                        {appointment.meetUrl && (
                          <div>
                            <Link to={appointment.meetUrl} target='_blank' className='py-4 px-8 rounded !text-secondary-main !underline'>
                              Meet URL
                            </Link>
                          </div>
                        )}
                      </div>
                      : appointment.address && (<div className='flex gap-16 items-center'>
                        <Typography className='w-68'>Address:</Typography>
                        <Typography className='font-semibold'>{appointment.address || ''}</Typography>
                      </div>)
                  }
                </div>
                <div className='flex gap-16'>
                  <Typography className='w-68'>Attendance:</Typography>
                  <Typography
                    className='font-semibold'
                    color={statusColor[appointment.status]}
                  >
                    {appointment.status}
                  </Typography>
                </div>
                {/* <div className='flex gap-8'>
                  <Typography className='w-52'>Reason: </Typography>
                  <Typography
                  >
                    {appointment.reason}
                  </Typography>
                </div> */}
                <Tooltip title={`View ${appointment.counselorInfo.profile.fullName}'s profile`}>
                  <ListItemButton	
                    component={NavLinkAdapter}
                    to={`counselor/${appointment.counselorInfo.profile.id}`}
					
                    className='bg-primary-main/10 w-full rounded'
                  >
                    <div className='w-full flex' onClick={()=> closeDialog()}>
                      <Avatar
                        alt={appointment.counselorInfo.profile.fullName}
                        src={appointment.counselorInfo.profile.avatarLink}
                      />
                      <div className='ml-16'>
                        <Typography className='font-semibold text-primary-main'>{appointment.counselorInfo.profile.fullName}</Typography>
                      </div>
                    </div>
                    <ChevronRight />
                  </ListItemButton>
                </Tooltip>
                {appointment.appointmentFeedback ?
                  <>
                    <div className='w-full'>
                      <Divider className='border border-black' />
                      <div className='flex items-start gap-16 mt-16'>
                        <Typography className='w-96'>Your feedback:</Typography>
						
                        <div>
                          <div>
                            <div className='flex items-center gap-8'>
                              <Rating
                                size='medium'
                                value={appointment.appointmentFeedback.rating}
                                readOnly
                              />
                              <Typography color='text.secondary'>{dayjs(appointment.appointmentFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
                            </div>
                          </div>
                          <Typography className='pl-8 mt-8' sx={{color: 'text.secondary'}}>{appointment.appointmentFeedback.comment}</Typography>
                        </div>

                      </div>
                    </div>
                  </>
                  : appointment.status === 'ATTEND' && <>
                    <Divider />
                    <div className='flex flex-col w-full justify-end gap-8 text-secondary-main '>
                      <Typography className='font-semibold'>Send feedback about the appointment!</Typography>
                      <div className='flex gap-16'>
                        <Button variant='outlined'
                          onClick={() => dispatch(openDialog({
                            children: (
                              <SendFeedbackDialog appointment={appointment} />
                            )
                          }))}
                        >
                          Leave a review
                        </Button>
                      </div>
                    </div>

                  </>
                }
              </div>
                

            </div>
		</Popover>
	);
};

const SendFeedbackDialog = ({ appointment }: { appointment: AppointmentScheduleType }) => {
	const [comment, setComment] = useState('')
	const [rating, setRating] = useState(0)
	const dispatch = useAppDispatch()
	const [sendFeedback] = useSendCouselingAppointmentFeedbackMutation()
	const handleSendFeedback = () => {
	  sendFeedback({
		appointmentId: Number.parseInt(appointment.id),
		feedback: {
		  comment,
		  rating
		}
	  })
	  dispatch(closeDialog())
	}
  
	return (
	  <div className='w-[40rem]'>
		<DialogTitle id="alert-dialog-title">Counselling session feedback</DialogTitle>
		<DialogContent>
		  <DialogContentText id="alert-dialog-description">
			<Typography>Send a feedback</Typography>
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

export default EventDetailDialog;
