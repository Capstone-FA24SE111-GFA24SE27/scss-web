import { closeDialog, CounselorAppointmentItem, NavLinkAdapter, openDialog, UserListItem } from '@/shared/components';
import {
	Avatar,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	FormControl,
	FormControlLabel,
	IconButton,
	ListItemButton,
	Menu,
	MenuItem,
	Paper,
	Radio,
	RadioGroup,
	Rating,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAppDispatch } from '@shared/store';
import {
	AccessTime,
	Add,
	CalendarMonth,
	ChevronRight,
	Circle,
	Clear,
	EditNote,
	MoreVert,
	Summarize,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
	AppointmentAttendanceStatus,
	Appointment,
} from '@/shared/types';
import {
	useTakeAppointmentAttendanceMutation,
	useUpdateAppointmentDetailsMutation,
} from '../../../counseling-api';
import { openStudentView } from '@/features/counselors/counselors-layout-slice';

type Props = {
	appointment: Appointment;
	onNavClicked: () => void;
};

export const EventDetailBody = (props: Props) => {
	const { appointment, onNavClicked } = props;

	const [openMenuId, setOpenMenuId] = useState<string | null>(null);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for the anchor element
	const [selectedAppointment, setSelectedAppointment] =
		useState<Appointment | null>(null); // Track selected appointment
	const navigate = useNavigate();
	const location = useLocation();
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
	}
	
	const handleLocalNavigate = (route: string) => {
		const pathSegments = location.pathname.split('/').filter(Boolean);

		// Create a new path using the first two segments
		const newPath = `/${pathSegments[0]}/${pathSegments[1]}/${route}`;

		return newPath;
	};

	if (!appointment) {
		return (
			<Typography color='text.secondary' variant='h5' className='p-16'>
				No appointments
			</Typography>
		);
	}

	return (
		<div onClick={handleNavClicked}>
			<CounselorAppointmentItem appointment={appointment} />
		</div>
	);
};
