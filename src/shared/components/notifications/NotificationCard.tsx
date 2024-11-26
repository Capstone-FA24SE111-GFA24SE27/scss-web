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
import { Icon } from '@mui/material';
import { Close } from '@mui/icons-material';
import { NotificationType } from '@/shared/types';


type NotificationCardProps = {
	item: NotificationType;
	className?: string;
	onClose: (T: number) => void;
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

	let bgColor: string =  defaultBgColor;
	// item.variant
	// ? (variantBgColors[item.variant] as string)
	// :
	// if (item.variant === 'primary') {
	// 	bgColor = theme.palette.primary.main;
	// }

	// if (item.variant === 'secondary') {
	// 	bgColor = theme.palette.secondary.main;
	// }

	const handleClose = (ev: MouseEvent<HTMLButtonElement>) => {
		ev.preventDefault();
		ev.stopPropagation();

		if (onClose && item && item.notificationId) {
			onClose(item.notificationId);
		}
	};

	return (
		<Card
			className={clsx(
				'relative flex min-h-96 w-full items-center space-x-8 rounded-16 py-12 px-20 shadow',
				className,
				item.readStatus && 'opacity-60'
			)}
			sx={{
				backgroundColor: bgColor,
				color: '#000',
				// ...(item.link
				// 	? { '&:hover': { backgroundColor: darken(bgColor, 0.05) } }
				// 	: {}),
			}}
			elevation={0}
			// component={item.link ? NavLinkAdapter : 'div'}
			// to={item.link || ''}
			// role={item.link && 'button'}
		>

			<div className='flex flex-col flex-auto w-full gap-2 pr-24'>
				{item.title && (
					<Typography className='font-semibold break-words line-clamp-1 text-wrap'>
						{item.title}
					</Typography>
				)}

				{item.message && (
					
						<Typography className='w-full break-words line-clamp-1 text-wrap'>{item.message}</Typography>
				)}

				{item.createdDate && (
					<Typography
						className='mt-8 text-sm leading-none '
						color='text.secondary'
					>
						{formatDistanceToNow(new Date(item.createdDate), {
							addSuffix: true,
						})}
					</Typography>
				)}
			</div>

			<IconButton
				disableRipple
				className='absolute top-0 p-8 right-2'
				color='inherit'
				size='small'
				onClick={handleClose}
			>
				<Close />
			</IconButton>
			
		</Card>
	);
}

export default NotificationCard;
