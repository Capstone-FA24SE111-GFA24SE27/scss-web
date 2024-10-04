import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import _ from 'lodash';
import { useAppDispatch } from '@shared/store';
import { useAppSelector } from '@shared/store';
import {
	closeNotificationPanel,
	selectNotificationPanelState,
	selectNotifications,
	toggleNotificationPanel,
} from './notification-slice';

import NotificationCard from './NotificationCard';
import { Close } from '@mui/icons-material';
import {
	useReadAllNotificationMutation,
	useReadNotificationMutation,
} from './notification-api';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		backgroundColor: theme.palette.background.default,
		width: 400,
		padding: 25.6,
	},
}));

/**
 * The notification panel.
 */
function NotificationPanel() {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const state = useAppSelector(selectNotificationPanelState);
	const notifications = useAppSelector(selectNotifications);

	const [readNotification] = useReadNotificationMutation();
	const [readAllNotificaion] = useReadAllNotificationMutation();

	useEffect(() => {
		if (state) {
			dispatch(closeNotificationPanel());
		}
	}, [location, dispatch]);

	function handleClose() {
		dispatch(closeNotificationPanel());
	}

	function handleDismiss(id: number) {
		readNotification(id);
	}

	function handleDismissAll() {
		readAllNotificaion();
	}

	return (
		<StyledSwipeableDrawer
			open={state}
			anchor='right'
			onOpen={() => {}}
			onClose={() => dispatch(toggleNotificationPanel())}
			disableSwipeToOpen
		>
			<IconButton
				className='absolute top-0 right-0 p-16 m-4 z-999'
				onClick={handleClose}
				size='large'
			>
				<Close />
			</IconButton>
			{/*  check if have notification here */}{' '}
			{notifications?.length > 0 ? (
				<div className='flex flex-col flex-auto max-h-full'>
					<div className='flex items-end justify-between mb-36'>
						<Typography className='font-semibold leading-none text-28'>
							Notifications
						</Typography>
					</div>
					<div className='flex flex-col flex-1 w-full overflow-auto'>
						{notifications.map((item) => (
							<NotificationCard
								key={item.notificationId}
								className='mb-16'
								item={item}
								onClose={handleDismiss}
							/>
						))}
					</div>
					<div className='flex justify-end w-full'>
						<Typography
							className='underline cursor-pointer text-14'
							color='secondary'
							onClick={handleDismissAll}
						>
							Mark All as Read
						</Typography>
					</div>
				</div>
			) : (
				<div className='flex items-center justify-center flex-1 p-16'>
					<Typography
						className='text-center text-24'
						color='text.secondary'
					>
						There are no notifications for now.
					</Typography>
				</div>
			)}
		</StyledSwipeableDrawer>
	);
}

export default NotificationPanel;
