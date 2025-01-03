import {
	ExpandableText,
	NavLinkAdapter,
	openDialog,
	UserLabel,
	RenderHTML,
	QuillEditor,
	closeDialog,
	BackdropLoading,
	setBackdropLoading,
	openDrawer,
	ExpandableContent,
	ItemMenu
} from '@/shared/components';
import {
	ArrowForward,
	ArrowRightAlt,
	Chat,
	ChatBubble,
	ChatBubbleOutline,
	CheckCircleOutlineOutlined,
	Close,
	Edit,
	EditNote,
	ExpandMore,
	Flag,
	HelpOutlineOutlined,
	Lock,
	RateReview,
	ThumbDown,
	ThumbDownOutlined,
	ThumbUp,
	ThumbUpOutlined,
	Visibility,
} from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Button,
	Chip,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	FormControlLabel,
	IconButton,
	MenuItem,
	Paper,
	Rating,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useAnswerQuestionMutation,
	useCloseQuestionCounselorMutation,
	useEditAnswerMutation,
	usePostFlagQuestionStatusMutation,
	usePostReviewQuestionStatusMutation,
} from '../qna-api';
import { Question } from '@/shared/types';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { openStudentView } from '../../counselors-layout-slice';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import QnaFlagForm from './QnaFlagFormDialog';
import { difficultyColor, statusColor } from '@/shared/constants';
import { useGetMessagesQuery } from '@/shared/components/chat/chat-api';
import { validateHTML } from '@/shared/utils';
import dayjs from 'dayjs';
import QnaRejectForm from './QnaRejectFormDialog';
import AnswerQuestionView from './AnswerQuestionView';

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const MyQnaItem = ({ qna }: { qna: Question }) => {
	const [expanded, setExpanded] = useState<number | boolean>(!qna.answer);

	const { data: chatData, isLoading } = useGetMessagesQuery(qna.id, {
		skip:
			!qna || qna.closed || !qna.chatSession || qna.status !== 'VERIFIED',
	});
	const chatSession = chatData?.content;
	const account = useAppSelector(selectAccount);

	const toggleAccordion =
		(panel: number) => (_: SyntheticEvent, _expanded: boolean) => {
			setExpanded(_expanded ? panel : false);
		};
	const navigate = useNavigate();

	const handleSelectChat = () => {
		navigate(`/qna/conversations/${qna.id}`);
	};

	const handleChat = () => {
		navigate(`chat/${qna.id}`);
	};


	const [closeQuestion, { isLoading: isLoadingCloseQuestion }] = useCloseQuestionCounselorMutation();

	const handleRejectQuestion = () => {
		dispatch(openDialog({
			children: <QnaRejectForm id={qna.id} />
		}))
	};

	const handleFlagQuestion = () => {
		dispatch(openDialog({
			children: <QnaFlagForm id={qna.id} />
		}))
	};

	const handleCloseQuestion = () => {
		useConfirmDialog({
			title: 'Are you sure you want to close the question?',
			confirmButtonFunction: async () => {
				closeQuestion(qna.id)
					.unwrap()
					.then((result) => {
						useAlertDialog({
							title: `Question has been closed successfully`,
							dispatch,
						});
					})
					.catch((err) => console.log(err));
			},
			dispatch,
		});
	};

	useEffect(() => {
		dispatch(setBackdropLoading(isLoadingCloseQuestion))
	}, [isLoadingCloseQuestion]);

	const dispatch = useAppDispatch();

	const countUnreadMessages = () => {
		const readMessages = chatSession?.messages.filter(
			(message) => message.sender.id !== account.id && !message.read
		);
		return readMessages?.length;
	};

	return (
		<motion.div variants={item}>
			<Paper className='overflow-hidden shadow'>
				<div className='p-16 space-y-16'>
					<div className='flex flex-col gap-8'>
						<div className='flex justify-between'>
							<Typography className='w-full pr-8 font-semibold text-lg'>
								{qna.title}
							</Typography>
							<ItemMenu
								className='size-24 mr-8'
								menuItems={[
									{
										label: 'View details',
										onClick: () => {
											// if (openDetail) {
											// 	dispatch(openDialog({
											// 		children: <AppointmentDetail id={appointment.id.toString()} />
											// 	}))
											// 	return;
											// }
											navigate(`qna-detail/${qna.id}`)
											// handleCloseDialog()
										},
										icon: <Visibility fontSize='small' />
									},
									{
										label: 'View chat',
										onClick: () => {
											navigate(`chat/${qna.id}`)
										},
										icon: <Chat fontSize='small' />,
										disabled: !qna.chatSession
									},
								]}
							/>
						</div>
						<div className='flex gap-8 items-center'>
							<UserLabel
								profile={qna?.student?.profile}
								label='Questioned by'
								email={qna?.student.email}
								onClick={() => {
									dispatch(
										openStudentView(qna?.student.id.toString())
									);
								}}
							/>
							<span className='text-text-secondary' >•</span>
							<Typography color='textSecondary'>{`${dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}</Typography>
						</div>
						<div className='flex gap-8'>
							<Chip
								label={qna.difficultyLevel}
								color={difficultyColor[qna.difficultyLevel as string]}
								size='small'
							/>
							<Chip
								label={qna.status.toLocaleLowerCase()}
								color={statusColor[qna.status as string]}
								size='small'
								className='capitalize'
								variant='outlined'
							/>
							{qna.answer ? (
								<Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
							) : (
								<Chip icon={<HelpOutlineOutlined />} label='Not Answered' size='small' variant='outlined' />

							)}

							{/* <Chip label={qna.topic?.name} size='small' /> */}
							{/* {qna.taken && <Chip label={`Taken by ${qna?.counselor.profile.fullName}`} variant='outlined' color={'success'} size='small' />} */}
							{qna.closed && (
								<Chip
									icon={<Lock />}
									label={'Closed'}
									variant='outlined'
									size='small'
								/>
							)}
							{countUnreadMessages() ? (
								<Chip
									label={countUnreadMessages()}
									size='small'
									variant='filled'
									color='secondary'
								/>
							) : (
								''
							)}
							{
								qna.accepted && (
									< Chip
										icon={<ThumbUpOutlined />}
										label={`Accepted by ${qna?.student.profile.fullName}`}
										size='small'
										variant='filled'
									/>
								)
							}
						</div>
					</div>
					<div className='flex flex-col justify-start gap-16'>
						<ExpandableContent>
							{RenderHTML(qna.content)}
						</ExpandableContent>
						<Divider />
						<div>
							{
								qna.answer
									? <div>
										<Typography className='font-semibold text-text-secondary'>Your answer</Typography>
										<ExpandableContent collapsedHeight={100}>
											{RenderHTML(qna.answer)}
										</ExpandableContent>
										{!qna.closed && (
											<Button
												color='secondary'
												startIcon={<EditNote fontSize='large' />}
												onClick={() => {
													dispatch(openDialog({
														children: <AnswerQuestionView qna={qna} />
													}))
												}}
											>
												Edit your answer
											</Button>
										)}
									</div>
									: qna.reviewReason
										? <div className='flex gap-8'>
											<Typography
												className='text-text-secondary'
											>
												{qna.status === `REJECTED` ? `Reject` : `Flag`} reason:
											</Typography>
											<Typography
												className='font-semibold'
												color='error'
											>
												{qna.reviewReason}
											</Typography>
										</div>
										: <Typography
											className='italic'
											color='textDisabled'
										>
											{'You have not answered the question'}
										</Typography>
							}
						</div>
						{
							qna.feedback && (
								<>
									<Divider />

									<div className='flex items-start gap-16'>
										<Typography color='textSecondary' className='pt-2 w-60'>Feedback:</Typography>
										<div className='flex-1'>
											<div>
												<div className='flex items-center gap-8'>
													<Rating
														size='medium'
														value={qna.feedback?.rating}
														readOnly
													/>
													<Typography color='text.secondary'>{dayjs(qna.feedback?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
												</div>
											</div>
											<ExpandableText className='pl-4 mt-8' text={qna.feedback?.comment} limit={96} />
										</div>
									</div>
								</>
							)
						}

					</div>
				</div>


				<Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5'>
					{!qna?.closed && (
						<Button
							variant='outlined'
							color='secondary'
							startIcon={<Lock />}
							onClick={() => handleCloseQuestion()}
						>
							Close
						</Button>
					)}
					{!qna?.answer &&
						!qna.closed &&
						(qna.status === 'PENDING' ||
							qna.status === 'VERIFIED') && (
							<Button
								variant='outlined'
								color='error'
								startIcon={<Flag />}
								onClick={handleFlagQuestion}
							>
								Flag
							</Button>
						)}
					{!qna?.answer &&
						!qna.closed &&
						(qna.status === 'PENDING' ||
							qna.status === 'VERIFIED') && (
							<div className='flex gap-8'>
								<Button
									variant='outlined'
									color='secondary'
									startIcon={<Close />}
									onClick={() => {
										handleRejectQuestion();
									}}
								>
									Reject
								</Button>
								<Button
									variant='contained'
									color='secondary'
									startIcon={<RateReview />}
									onClick={() => {
										dispatch(openDialog({
											children: <AnswerQuestionView qna={qna} />
										}))
									}}
								>
									Answer
								</Button>
							</div>

						)}
					{qna.chatSession && !qna.closed && (
						<Button
							variant='contained'
							color='secondary'
							onClick={handleChat}
							disabled={!qna?.answer}
							endIcon={<ChatBubbleOutline />}
						>
							Chat
						</Button>
					)}
				</Box>
			</Paper>
		</motion.div>
	);
};

export default MyQnaItem;
