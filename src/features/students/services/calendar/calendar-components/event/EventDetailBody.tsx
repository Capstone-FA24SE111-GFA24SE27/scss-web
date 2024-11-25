import { closeDialog, NavLinkAdapter, openDialog, StudentAppointmentItem, UserListItem } from '@/shared/components';
import {
	Avatar,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	ListItemButton,
	Rating,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useSendCouselingAppointmentFeedbackMutation } from '../../../activity/activity-api';
import { useAppDispatch } from '@shared/store';
import {
	AccessTime,
	CalendarMonth,
	ChevronRight,
	Circle,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { AppointmentScheduleType } from '@/shared/types';
import { openCounselorView } from '@/features/students/students-layout-slice';

type Props = {
	appointment: AppointmentScheduleType;
	onNavClicked: () => void;
};

export const EventDetailBody = (props: Props) => {
	const { appointment, onNavClicked } = props;
	const dispatch = useAppDispatch();

	const statusColor = {
		REJECTED: 'error',
		ABSENT: 'error',
		WAITING: 'warning',
		APPROVED: 'success',
		ATTEND: 'success',
	};

	function handleNavClicked() {
		if (onNavClicked) {
			onNavClicked();
		}
		// dispatch(openCounselorView(appointment.counselorInfo.profile.id.toString()))
	}

	if (!appointment) {
		return null;
	}

	return (
		<div >
			{/* @ts-ignore */}
			<StudentAppointmentItem appointment={appointment} handleCloseDialog={handleNavClicked} />
		</div>
	);
};