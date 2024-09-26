import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import _ from 'lodash';
import { useSnackbar } from 'notistack';

import { useAppDispatch } from '@shared/store';
import { useAppSelector } from '@shared/store';
import {
	closeNotificationPanel,
	selectNotificationPanelState,
	toggleNotificationPanel,
} from './notification-slice';
import NotificationModel from './models/notification-models';
import NotificationTemplate from './NotificationTemplate';
import NotificationCard from './NotificationCard';
import { Close, Fireplace } from '@mui/icons-material';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
	'& .MuiDrawer-paper': {
		backgroundColor: theme.palette.background.default,
		width: 320,
	},
}));

/**
 * The notification panel.
 */
function NotificationPanel() {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const state = useAppSelector(selectNotificationPanelState);

	// const [deleteNotification] = useDeleteNotificationMutation();
	// const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
	// const [addNotification] = useCreateNotificationMutation();

	// const { data: notifications, isLoading } = useGetAllNotificationsQuery();

	useEffect(() => {
		console.log(state);
	}, [state]);

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	useEffect(() => {
		if (state) {
			dispatch(closeNotificationPanel());
		}
	}, [location, dispatch]);

	useEffect(() => {
		const item = NotificationModel({
			title: 'New Fuse React version is released! ',
			description:
				' Checkout the release notes for more information. 🚀 ',
			icon: <Fireplace />,
			variant: 'primary',
		});

		setTimeout(() => {
			// addNotification(item);

			enqueueSnackbar(item.title, {
				key: item.id,
				autoHideDuration: 6000,
				content: (
					<NotificationTemplate
						item={item}
						onClose={() => {
							closeSnackbar(item.id);
						}}
					/>
				),
			});
		}, 2000);
	}, []);

	function handleClose() {
		dispatch(closeNotificationPanel());
	}

	function handleDismiss(id: string) {
		// deleteNotification(id);
	}

	function handleDismissAll() {
		// deleteAllNotifications();
	}

	function demoNotification() {
		const item = NotificationModel({
			title: 'Great Job! this is awesome.',
		});

		// addNotification(item);

		enqueueSnackbar(item.title, {
			key: item.id,
			autoHideDuration: 3000,
			content: (
				<NotificationTemplate
					item={item}
					onClose={() => {
						closeSnackbar(item.id);
					}}
				/>
			),
		});
	}

	// if (isLoading) {
	// 	return <FuseLoading />;
	// }

	return (
		<StyledSwipeableDrawer
			open={state}
			anchor='right'
			onOpen={() => {}}
			onClose={() => dispatch(toggleNotificationPanel())}
			disableSwipeToOpen
		>
			<IconButton
				className='absolute top-0 right-0 m-4 z-999'
				onClick={handleClose}
				size='large'
			>
				<Close />
			</IconButton>

			<div className='flex flex-col h-full p-16'>
				{/*  check if have notification here */}{' '}
				{true ? (
					<div className='flex flex-col flex-auto'>
						<div className='flex items-end justify-between mb-36 pt-136'>
							<Typography className='font-semibold leading-none text-28'>
								Notifications
							</Typography>
							<Typography
								className='underline cursor-pointer text-12'
								color='secondary'
								onClick={handleDismissAll}
							>
								dismiss all
							</Typography>
						</div>
						<NotificationCard
							className='mb-16'
							item={{
								title: 'New Fuse React version is released! ',
								description:
									' Checkout the release notes for more information. 🚀 ',
								link: '/documentation/changelog',
								icon: <Fireplace />,
								variant: 'primary',
							}}
							onClose={handleDismiss}
						/>
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
				<div className='flex items-center justify-center py-16'>
					<Button
						size='small'
						variant='outlined'
						onClick={demoNotification}
					>
						Create a notification example
					</Button>
				</div>
			</div>
		</StyledSwipeableDrawer>
	);
}

export default NotificationPanel;
