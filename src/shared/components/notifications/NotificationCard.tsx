import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { MouseEvent } from 'react';
import { darken, useTheme } from '@mui/material/styles';
import green from '@mui/material/colors/green';
import blue from '@mui/material/colors/blue';
import red from '@mui/material/colors/red';
import orange from '@mui/material/colors/orange';
import yellow from '@mui/material/colors/yellow';
import { NotificationModelType } from './models/notification-models';
import NavLinkAdapter from '../link/NavLinkAdapter';
import { Icon } from '@mui/material';
import { Close } from '@mui/icons-material';

type NotificationCardProps = {
	item: NotificationModelType;
	className?: string;
	onClose: (T: string) => void;
};

const variantBgColors = {
	primary: orange[50],
	success: green[600],
	info: blue[700],
	error: red[600],
	warning: orange[600],
	alert: yellow[700],
	secondary: blue[700],
};

/**
 * The notification card.
 */
function NotificationCard(props: NotificationCardProps) {
	const { item, className, onClose } = props;
	const theme = useTheme();

	const defaultBgColor = theme.palette.background.paper;

	let bgColor: string = item.variant
		? (variantBgColors[item.variant] as string)
		: defaultBgColor;

	if (item.variant === 'primary') {
		bgColor = theme.palette.primary.main;
	}

	if (item.variant === 'secondary') {
		bgColor = theme.palette.secondary.main;
	}

	const handleClose = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		ev.stopPropagation();

		if (onClose && item && item.id) {
			onClose(item.id);
		}
	};

	return (
		<Card
			className={clsx(
				'relative flex min-h-64 w-full items-center space-x-8 rounded-16 p-20 shadow',
				className
			)}
			sx={{
				backgroundColor: bgColor,
				color: '#000',
				...(item.link
					? { '&:hover': { backgroundColor: darken(bgColor, 0.05) } }
					: {}),
			}}
			elevation={0}
			component={item.link ? NavLinkAdapter : 'div'}
			to={item.link || ''}
			role={item.link && 'button'}
		>
			{item.icon && !item.image && (
				<Box
					sx={{ backgroundColor: darken(bgColor, 0.1) }}
					className='flex items-center justify-center w-32 h-32 mr-12 rounded-full shrink-0'
				>
					<Icon className='opacity-75' color='inherit'>
						{item.icon}
					</Icon>
				</Box>
			)}

			{item.image && (
				<img
					className='object-cover object-center w-32 h-32 mr-12 overflow-hidden rounded-full shrink-0'
					src={item.image}
					alt='Notification'
				/>
			)}

			<div className='flex flex-col flex-auto'>
				{item.title && (
					<Typography className='font-semibold line-clamp-1'>
						{item.title}
					</Typography>
				)}

				{item.description && (
					<div
						className='line-clamp-2'
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: item.description }}
					/>
				)}

				{item.time && (
					<Typography
						className='mt-8 text-sm leading-none '
						color='text.secondary'
					>
						{formatDistanceToNow(new Date(item.time), {
							addSuffix: true,
						})}
					</Typography>
				)}
			</div>

			<IconButton
				disableRipple
				className='absolute top-0 right-0 p-8'
				color='inherit'
				size='small'
				onClick={handleClose}
			>
				<Close />
			</IconButton>
			{item.children}
		</Card>
	);
}

export default NotificationCard;
