import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { useAppDispatch, useAppSelector } from '@shared/store';
import {
	addNotification,
	selectNotifications,
	setNotifications,
	toggleNotificationPanel,
} from './notification-slice';
import { useSocket } from '@/shared/context';
import { selectAccount } from '@shared/store';
import { useGetAllNotificationsQuery } from './notification-api';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import NotificationTemplate from './NotificationTemplate';
import { NotificationType } from '../type/notification';

type NotificationPanelToggleButtonProps = {
	children?: ReactNode;
};

/**
 * The notification panel toggle button.
 */

function NotificationPanelToggleButton(
	props: NotificationPanelToggleButtonProps
) {
	const { children = <NotificationsNoneIcon /> } = props;
	const dispatch = useAppDispatch();
	const controls = useAnimation();
	const socket = useSocket();
	const account = useAppSelector(selectAccount);
	const notifications = useAppSelector(selectNotifications);

	const [animate, setAnimate] = useState(false);
	const prevNotificationCount = useRef(notifications?.length);
	const theme = useTheme();

	const { data, isLoading } = useGetAllNotificationsQuery();

	useEffect(() => {
		const cb = (data: NotificationType) => {
			dispatch(addNotification(data));
			console.log('socket', data);
			enqueueSnackbar(data.title, {
				key: data.notificationId,
				autoHideDuration: 5000,
				content: (
					<NotificationTemplate
						item={data}
						onClose={() => {
							closeSnackbar(data.notificationId);
						}}
					/>
				),
			});
		};
		if (socket && account) {
			socket.on(`/user/${account.id}/private/notification`, cb);
		}

		return () => {
			socket.off(`/user/${account.id}/private/notification`, cb);
		};
	}, [socket]);

	useEffect(() => {
		if (data) {
			console.log('noti query', data);
			dispatch(setNotifications(data.content.data));
		}
	}, [data]);

	useEffect(() => {
		if (animate) {
			controls.start({
				rotate: [0, 20, -20, 0],
				color: [theme.palette.secondary.main],
				transition: { duration: 0.2, repeat: 5 },
			});
		} else {
			controls.start({
				rotate: 0,
				scale: 1,
				color: theme.palette.text.secondary,
			});
		}
	}, [animate, controls]);

	useEffect(() => {
		if (notifications?.length > prevNotificationCount.current) {
			setAnimate(true);
			const timer = setTimeout(() => setAnimate(false), 1000); // Reset after 1 second
			return () => clearTimeout(timer);
		}

		prevNotificationCount.current = notifications?.length;
		return undefined;
	}, [notifications?.length]);

	return (
		<IconButton
			className='w-40 h-40'
			onClick={() => dispatch(toggleNotificationPanel())}
		>
			<Badge
				color='secondary'
				variant='dot'
				invisible={notifications?.length === 0}
			>
				<motion.div animate={controls}>{children}</motion.div>
			</Badge>
		</IconButton>
	);
}

export default NotificationPanelToggleButton;
