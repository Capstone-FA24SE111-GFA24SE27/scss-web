import { ExpandableText, NavLinkAdapter, UserLabel, RenderHTML, openDialog, ExpandableContent, ItemMenu } from '@/shared/components';
import React, { SyntheticEvent } from 'react';
import { motion } from 'framer-motion';
import {
	Chat,
	ChatBubbleOutline,
	CheckCircleOutlineOutlined,
	Close,
	Delete,
	Edit,
	ExpandMore,
	HelpOutlineOutlined,
	Lock,
	RateReview,
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
	Divider,
	Paper,
	Rating,
	Typography,
	styled,
} from '@mui/material';
import { Question } from '@/shared/types';
import {
	useAcceptQuestionStudentMutation,
	useCloseQuestionStudentMutation,
	useCreateChatSessionStudentMutation,
	useDeleteQuestionStudentMutation,
} from './qna-api';
import { useNavigate } from 'react-router-dom';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { statusColor, statusLabel } from '@/shared/constants';
import { useGetMessagesQuery } from '@/shared/components/chat/chat-api';
import { openCounselorView } from '../../students-layout-slice';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import dayjs from 'dayjs';
import QnaSendFeedbackDialog from './QnaSendFeedbackDialog';

export const StyledAccordionSummary = styled(AccordionSummary)({
	display: 'flex',
	alignItems: 'flex-start',  // Align content at the top
});

type Props = {
	qna: Question;
};
const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const QnaItem = (props: Props) => {
	const { qna } = props;

	const { data, isLoading } = useGetMessagesQuery(qna.id, { skip: !qna || qna.closed || !qna.chatSession || qna.status !== 'VERIFIED' });
	const chatSession = data?.content;

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const account = useAppSelector(selectAccount);

	const [closeQuestion] = useCloseQuestionStudentMutation();
	const [acceptAnswer, { isLoading: isLoadingAcceptAnswer }] = useAcceptQuestionStudentMutation();
	const [deleteQuestion, { isLoading: isDeletingQuestion }] = useDeleteQuestionStudentMutation();
	const [createChatSession, { isLoading: isLoadingCreateChat }] = useCreateChatSessionStudentMutation();

	const handleSelectChat = (qna: Question) => {
		if (qna.chatSession) {
			navigate(`conversations/${qna.id}`);
		} else {
			handleCreateChat(qna);
		}
	};

	// const handleCloseQuestion = async () => {
	// 	useConfirmDialog(
	// 		{
	// 			title: 'Are you sure you want to close the question?',
	// 			confirmButtonFunction: async () => {
	// 				const result = await closeQuestion(qna.id)
	// 				console.log('close qna', result)
	// 				useAlertDialog({
	// 					title: result.data.message,
	// 					dispatch
	// 				})
	// 			},
	// 			dispatch
	// 		}
	// 	)
	// }

	const handleAcceptAnswer = async () => {
		useConfirmDialog(
			{
				title: 'Confirm accepting this answer?',
				confirmButtonFunction: async () => {
					const result = await acceptAnswer(qna.id)
					// @ts-ignore
					if (result?.data?.status === 200) {
						useAlertDialog({
							title: `Answer accepted`,
							dispatch
						})
					}
				},
				dispatch
			}
		)
	}

	const handleCreateChat = async (qna: Question) => {
		const result = await createChatSession(qna.id);
		console.log(result);
		if (result?.data?.status === 200) {
			useConfirmDialog({
				title: 'Chat session created successfully',
				cancelButtonTitle: 'Ok',
				confirmButtonTitle: 'Go to chat',
				confirmButtonFunction: () =>
					navigate(`conversations/${qna.id}`),
				dispatch: dispatch,
			});
		}
	};

	const handleDeleteQuestion = () => {
		useConfirmDialog({
			title: 'Confirm deleting the question?',
			content: 'This action will permanently delete the question and cannnot be undone',
			confirmButtonFunction: () => {
				deleteQuestion(qna.id)
					.unwrap()
					.then(() => {
						useAlertDialog({
							title: 'Question was deleted successfully',
							dispatch: dispatch,
							color: 'success'
						});
					})
					.catch(() => {
						useAlertDialog({
							title: 'Failed to delete question',
							dispatch: dispatch,
							color: 'error'
						});
					})
			},
			dispatch,
		});
	}

	const countUnreadMessages = () => {
		const readMessages = chatSession?.messages.filter(
			(message) => message.sender.id !== account.id && !message.read
		);
		return readMessages?.length;
	};

	return (
		<motion.div variants={item}>
			<Paper className='overflow-hidden shadow'>
				<div
					className='shadow '
				>
					<div
						className='p-16 space-y-16'
					>
						<div className='flex flex-col gap-8 w-full'>
							<div className='flex justify-between'>
								<Typography className='w-full pr-8 font-semibold text-lg line-clamp-2'>
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
												navigate(`conversations/${qna.id}`)
											},
											icon: <Chat fontSize='small' />,
											disabled: !qna.chatSession
										},
									]}
								/>
							</div>
							<Typography color='textSecondary' className=''>Created at {dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
							<div className='flex gap-8'>
								{qna.answer ? (
									<Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
								) : (
									<Chip icon={<HelpOutlineOutlined />} label='Not Answered' size='small' variant='outlined' />
								)}

								<Chip
									label={
										qna.questionType === 'ACADEMIC'
											? 'Academic'
											: 'Non-Academic'
									}
									color={'secondary'}
									variant='outlined'
									size='small'
								/>
								<Chip
									label={qna.status?.toLowerCase()}
									color={statusColor[qna.status as string]}
									size='small'
									className='!capitalize'
								/>
								{
									qna.accepted && (
										< Chip
											icon={<ThumbUpOutlined />}
											label={`Accepted`}
											size='small'
											variant='filled'
										/>
									)
								}

								{qna.closed && (
									<Chip
										icon={<Lock />}
										label={'Closed'}
										variant='outlined'
										size='small'
									/>
								)}


								<div className='w-full flex justify-end pr-8'>
									{/* <Chip
										label={`Created at ${dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}
										size='small'
										color='default'
									/> */}
								</div>

								{countUnreadMessages() ? (
									<Chip
										label={`${countUnreadMessages()} unread messages`}
										size='small'
										variant='filled'
										color='secondary'
									/>
								) : (
									''
								)}
							</div>

						</div>

						<div>
							<div className='flex flex-col gap-8 w-full'>
								<ExpandableContent>
									{RenderHTML(qna.content)}
								</ExpandableContent>
								<Divider />

								<div>
									{
										qna.counselor && (
											<UserLabel
												label={`${([`PENDING`].includes(qna.status) || qna.answer) ? 'Answered' : statusLabel[qna.status]} by`}
												profile={qna?.counselor.profile}
												email={qna?.counselor?.email}
												onClick={() => {
													dispatch(
														openCounselorView(
															qna?.counselor.profile.id.toString()
														)
													);
												}}
											/>
										)
									}
									{!qna.counselor ? (
										<Typography
											className='px-8 italic'
											color='textDisabled'
										>
											{'No counselor has taken this question'}
										</Typography>
									)
										: qna.answer ? (
											<ExpandableContent collapsedHeight={100}>
												{RenderHTML(qna.answer)}
											</ExpandableContent>
										)
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
													{'The counselor has not answered the question'}
												</Typography>
									}
								</div>

								{
									qna?.feedback && (
										<>
											<Divider />
											<div className='flex items-start gap-16 '>
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
													{/* <Typography className='pl-8 mt-8' sx={{ color: 'text.secondary' }}>{qna.feedback.comment}</Typography> */}
												</div>
											</div>
										</>

									)

								}
							</div>
						</div>

					</div>
					<Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5 '>
						{/* <div className='flex items-start w-112'>
							<IconButton><ThumbUpOutlined /></IconButton>
							<IconButton><ThumbDownOutlined /></IconButton>
						  </div> */}
						{qna.status == 'PENDING' && !qna.answer && (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Delete />}
								disabled={isDeletingQuestion}
								onClick={() => handleDeleteQuestion()}
							>
								Delete
							</Button>
						)}

						{qna.status == 'PENDING' && !qna.answer && (
							<Button
								variant='contained'
								color='secondary'
								component={NavLinkAdapter}
								to={`edit/${qna.id}`}
								startIcon={<Edit />}
							>
								Edit Question
							</Button>
						)}

						{!qna.closed && qna.status == 'VERIFIED' && qna?.answer && (
							<Button
								variant='contained'
								color='secondary'
								startIcon={<ChatBubbleOutline />}
								onClick={() => handleSelectChat(qna)}
								disabled={!qna.counselor || isLoadingCreateChat}
							>
								{qna.chatSession ? `Chat` : `Start to Chat`}
							</Button>
						)}

						{qna.answer && !qna.closed && !qna.accepted && (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<ThumbUp />}
								onClick={handleAcceptAnswer}
								disabled={isLoadingAcceptAnswer}
							>
								Accept
							</Button>
						)}

						{qna.closed && !qna.feedback && (
							<Button
								variant='contained'
								color='secondary'
								startIcon={<RateReview />}
								onClick={(e) => {
									e.stopPropagation()
									dispatch(openDialog({
										children: (
											<QnaSendFeedbackDialog
												questionCard={qna}
											/>
										)
									}))
								}}
							>
								Leave a review
							</Button>
						)}

					</Box>
				</div>
			</Paper>
		</motion.div >
	);
};

export default QnaItem;

