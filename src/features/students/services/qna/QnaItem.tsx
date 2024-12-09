import { ExpandableText, NavLinkAdapter, UserLabel, RenderHTML } from '@/shared/components';
import React, { SyntheticEvent } from 'react';
import { motion } from 'framer-motion';
import {
	ChatBubbleOutline,
	CheckCircleOutlineOutlined,
	Close,
	Delete,
	Edit,
	ExpandMore,
	HelpOutlineOutlined,
	Lock,
} from '@mui/icons-material';
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Avatar,
	Box,
	Button,
	Chip,
	Paper,
	Typography,
	styled,
} from '@mui/material';
import { Question } from '@/shared/types';
import {
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


export const StyledAccordionSummary = styled(AccordionSummary)({
	display: 'flex',
	alignItems: 'flex-start',  // Align content at the top
});

type Props = {
	expanded: number | boolean;
	toggleAccordion: (
		panel: number
	) => (_: SyntheticEvent, _expanded: boolean) => void;
	qna: Question;
	openAnswers: boolean;
};
const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

const QnaItem = (props: Props) => {
	const { expanded, toggleAccordion, qna, openAnswers } = props;

	const { data, isLoading } = useGetMessagesQuery(qna.id, { skip: !qna || qna.closed || !qna.chatSession || qna.status !== 'VERIFIED' });
	const chatSession = data?.content;

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const account = useAppSelector(selectAccount);

	const [closeQuestion] = useCloseQuestionStudentMutation();
	const [deleteQuestion, { isLoading: isDeletingQuestion }] = useDeleteQuestionStudentMutation();
	const [createChatSession] = useCreateChatSessionStudentMutation();

	const handleSelectChat = (qna: Question) => {
		if (qna.chatSession) {
			navigate(`conversations/${qna.id}`);
		} else {
			handleCreateChat(qna);
		}
	};

	const handleCloseQuestion = async () => {

		useConfirmDialog(
			{
				title: 'Are you sure you want to close the question?',
				confirmButtonFunction: async () => {
					const result = await closeQuestion(qna.id)
					console.log('close qna', result)
					// if(result?.data?.status === 200) {
					useAlertDialog({
						title: result.data.message,
						dispatch
					})
					// }
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
				<Accordion
					className='shadow'
					expanded={expanded === qna.id || openAnswers}
					onChange={toggleAccordion(qna.id)}
				>
					<AccordionSummary
						// expandIcon={<ExpandMore />}
						expandIcon={<ExpandMore sx={{ fontSize: '3rem', height: '6rem' }} />}

					>
						<div className='flex flex-col gap-8 w-full'>
							<div className='flex gap-8'>
								{qna.answer ? (
									<Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
								) : (
									<HelpOutlineOutlined color='disabled' />
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
									label={qna.status}
									color={statusColor[qna.status as string]}
									size='small'
								/>
								{qna.closed && (
									<Chip
										icon={<Lock />}
										label={'Closed'}
										variant='outlined'
										size='small'
									/>
								)
								}
								<div className='w-full flex justify-end pr-8'>
									{/* <Chip
										label={`Created at ${dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}`}
										size='small'
										color='default'
									/> */}
								</div>

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
							</div>
							<Typography color='textSecondary' className=''>Created at {dayjs(qna.createdDate).format('YYYY-MM-DD HH:mm:ss')}</Typography>
							<div className='flex items-center flex-1 gap-8'>

								<Typography className='w-full pr-8 font-semibold'>
									{qna.title}
								</Typography>
							</div>
						</div>
					</AccordionSummary>

					<AccordionDetails className='flex'>
						<div className='flex flex-col gap-8'>
							{RenderHTML(qna.content)}
							{
								qna.counselor && (
									<UserLabel
										label={`${([`PENDING`].includes(qna.status) || qna.answer) ? 'Answered' : statusLabel[qna.status] } by`}
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
									<div>
										{RenderHTML(qna.answer)}
									</div>
								)
									: qna.reviewReason
										? <div className='flex gap-8'>
											<Typography
												className='text-text-secondary'
											>
												Flagged reason:
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
					</AccordionDetails>
					<Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5 '>
						{/* <div className='flex items-start w-112'>
							<IconButton><ThumbUpOutlined /></IconButton>
							<IconButton><ThumbDownOutlined /></IconButton>
						  </div> */}
						{qna.status == 'PENDING' && !qna.answer ? (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Delete />}
								disabled={isDeletingQuestion}
								onClick={() => handleDeleteQuestion()}
							>
								Delete
							</Button>
						) : qna.status == 'VERIFIED' && !qna?.closed ? (<></>
							// <Button
							// 	variant='outlined'
							// 	color='secondary'
							// 	startIcon={<Lock />}
							// 	onClick={() => handleCloseQuestion()}
							// >
							// 	Close
							// </Button>
						) : (
							<></>
						)}
						{qna.status == 'PENDING' && !qna.answer ? (
							<Button
								variant='contained'
								color='secondary'
								component={NavLinkAdapter}
								to={`edit/${qna.id}`}
								startIcon={<Edit />}
							>
								Edit Question
							</Button>
						) : qna.chatSession ? (
							<Button
								variant='contained'
								color='secondary'
								startIcon={<ChatBubbleOutline />}
								onClick={() => handleSelectChat(qna)}
								disabled={!qna.counselor}
							>
								Go Chat
							</Button>
						) : (
							<Button
								variant='contained'
								color='secondary'
								startIcon={<ChatBubbleOutline />}
								onClick={() => handleSelectChat(qna)}
								disabled={!qna.counselor || qna.closed || qna.status !== 'VERIFIED'}
							>
								Start to Chat
							</Button>
						)}
					</Box>
				</Accordion>
			</Paper>
		</motion.div>
	);
};

export default QnaItem;
