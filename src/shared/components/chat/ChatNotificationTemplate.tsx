import { ForwardedRef, forwardRef, MouseEvent } from 'react';
import { SnackbarContent } from 'notistack';
import { Message, Question } from '@/shared/types';
import { CardActionArea, useTheme } from '@mui/material';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { selectAccount } from '@shared/store';
import { roles } from '@/shared/constants';
import { useAppSelector } from '@shared/store';

type ChatNotificationTemplateProps = {
	item: Message;
	qna: Question;
	onClose: (id: number) => void;
	className?: string;
};

const ChatNotificationTemplate = forwardRef(
	(
		props: ChatNotificationTemplateProps,
		ref: ForwardedRef<HTMLDivElement>
	) => {
		const { item, className, onClose, qna } = props;
		const theme = useTheme();
		const navigate = useNavigate();
		const account = useAppSelector(selectAccount);

		const defaultBgColor = theme.palette.background.paper;

		let bgColor: string = defaultBgColor;

		const handleClose = (ev: MouseEvent<HTMLButtonElement>) => {
			ev.preventDefault();
			ev.stopPropagation();

			if (onClose && item && item.id) {
				onClose(item.id);
			}
		};

		const handleClick = (ev: MouseEvent<HTMLButtonElement>) => {
			if (account?.role === roles.STUDENT) {
				navigate(`services/qna/conversations/${qna.id}`, {
					replace: true,
				});
			} else if (
				account?.role === roles.ACADEMIC_COUNSELOR ||
				account?.role === roles.NON_ACADEMIC_COUNSELOR
			) {
				navigate(`/qna/conversations/${qna.id}`, { replace: true });
			}
			handleClose(ev);
		};

		return (
			<SnackbarContent
				ref={ref}
				className='relative w-full mx-auto pointer-events-auto max-w-320 z-999'
			>
				<Card
					className={clsx(
						'relative flex min-h-96 w-full items-center rounded-16  shadow',
						className
					)}
					sx={{
						backgroundColor: bgColor,
						color: '#000',
					}}
					elevation={0}
					component={'div'}
				>
					<CardActionArea onClick={handleClick} className='w-full h-full px-20 py-12'>
						<div className='flex flex-col flex-auto pr-24 '>
							<Typography className='font-semibold line-clamp-1'>
								{item.sender.profile.fullName} sent you a
								message
							</Typography>

							{item.content && (
								<div
									className='flex justify-start line-clamp-2'
									dangerouslySetInnerHTML={{
										__html: item.content,
									}}
								/>
							)}

							{item.sentAt && (
								<Typography
									className='flex justify-start mt-8 text-sm leading-none'
									color='text.secondary'
								>
									{formatDistanceToNow(
										new Date(item.sentAt),
										{
											addSuffix: true,
										}
									)}
								</Typography>
							)}
						</div>
					</CardActionArea>
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
			</SnackbarContent>
		);
	}
);

export default ChatNotificationTemplate;
