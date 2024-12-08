import {
	ExpandableText,
	NavLinkAdapter,
	openDialog,
	UserLabel,
	RenderHTML,
	QuillEditor,
	closeDialog,
	BackdropLoading
} from '@/shared/components';
import {
	ArrowForward,
	ArrowRightAlt,
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
		navigate(`${qna.id}`);
	};


	const [closeQuestion] = useCloseQuestionCounselorMutation();
	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();

	const handleRejectQuestion = (id: number) => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to reject this question?',
			confirmButtonFunction: () => {
				reviewQuestion({
					id: id,
					status: 'REJECTED',
				})
					.unwrap()
					.then((result) => {
						console.log(result);
						if (result?.data?.status === 200) {
							useAlertDialog({
								title: 'Question is rejected successfully',
								dispatch: dispatch,
							});
							setExpanded(false);
						} else {
							useAlertDialog({
								title: result.data.message,
								color: 'error',
								dispatch: dispatch,
							});
						}
					})
					.catch((err) => console.log(err));
			},
		});
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
						console.log('close qna', result);
						// if (result?.data?.status === 200) {
						// 	useAlertDialog({
						// 		title: result.data.message,
						// 		dispatch,
						// 	});
						// 	setExpanded(false);
						// } else {
						// 	useAlertDialog({
						// 		title: result.data.message,
						// 		dispatch: dispatch,
						// 	});
						// }
					})
					.catch((err) => console.log(err));
			},
			dispatch,
		});
	};

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
				<Accordion
					className='shadow'
				// expanded={expanded === qna.id || expanded === true}
				// onChange={toggleAccordion(qna.id)}
				>
					<AccordionSummary expandIcon={<ExpandMore />} className=''>
						<div className='flex flex-col gap-8'>
							<div className='flex gap-8'>
								{qna.answer ? (
									<Chip icon={<CheckCircleOutlineOutlined />} label='Answered' color='success' size='small' variant='outlined' />
								) : (
									<HelpOutlineOutlined color='disabled' />
								)}
								<Chip
									label={qna.difficultyLevel}
									color={difficultyColor[qna.difficultyLevel as string]}
									size='small'
									variant='outlined'
								/>
								<Chip
									label={qna.status}
									color={statusColor[qna.status as string]}
									size='small'
								/>
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
							</div>
							<div className='flex gap-8 items-center mt-8'>
								<UserLabel
									profile={qna?.student?.profile}
									label='Asked by'
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

							<div className='flex items-center flex-1 gap-8'>
								{/* <Divider orientation='vertical' /> */}

								<Typography className='w-full pr-8 font-semibold'>
									{RenderHTML(qna.title)}
								</Typography>
							</div>
						</div>
					</AccordionSummary>

					<AccordionDetails className='flex flex-col justify-start gap-16'>
						<Typography className='w-full pr-8'>
							{RenderHTML(qna.content)}
						</Typography>
						<Divider />
						<div>
							{
								qna.answer
									? <div>
										<Typography className='font-semibold' color='textSecondary'>Your answer</Typography>
										<Typography>{RenderHTML(qna.answer)}</Typography>
										{!qna.closed && (
											<Button
												color='secondary'
												startIcon={<EditNote fontSize='large' />}
												onClick={() => {
													dispatch(openDialog({
														children: <AnswerQuestionDialog qna={qna} />
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
											{'You have not answered the question'}
										</Typography>
							}
						</div>
					</AccordionDetails>
					<Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5'>
						{!qna?.closed && qna?.answer && (
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
											handleRejectQuestion(qna.id);
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
												children: <AnswerQuestionDialog qna={qna} />
											}))
										}}
									>
										Answer
									</Button>
								</div>

							)}
						{qna.chatSession && (
							<>
								<Button
									variant='contained'
									color='secondary'
									onClick={handleChat}
									disabled={!qna?.answer}
									endIcon={<ChatBubbleOutline />}
								>
									Chat
								</Button>
								<Button
									variant='contained'
									color='primary'
									onClick={handleSelectChat}
									endIcon={<ArrowForward />}
									disabled={qna?.closed}
								>
									Go to conversations
								</Button>
							</>
						)}
					</Box>
				</Accordion>
			</Paper>
		</motion.div>
	);
};

export default MyQnaItem;


import React from 'react'
import { validateHTML } from '@/shared/utils';
import dayjs from 'dayjs';

const AnswerQuestionDialog = ({ qna }: { qna: Question }) => {
	const editMode = Boolean(qna.answer)
	console.log(editMode)

	const [answer, setAnswer] = useState(qna.answer || ``);

	const [answerQuestion, { isLoading: submitingAnswer }] =
		useAnswerQuestionMutation();

	const [editAnswer, { isLoading: editingAnswer }] =
		useEditAnswerMutation();

	const dispatch = useAppDispatch()


	const handleAnswerQuestion = () => {
		useConfirmDialog({
			title: 'Are you sure you want to submit the answer?',
			confirmButtonFunction: onSubmitAnswer,
			dispatch,
		});
	}


	const onSubmitAnswer = () => {
		if (editMode) {
			editAnswer({
				questionCardId: qna.id,
				content: answer,
			})
				.unwrap()
				.then(() => {
					useAlertDialog({
						title: " Answer edited successfully",
						dispatch,
					})
					dispatch(closeDialog())
				})
		} else {
			answerQuestion({
				questionCardId: qna.id,
				content: answer,
			})
				.unwrap()
				.then(() => {
					useAlertDialog({
						title: " Answer submitted successfully",
						dispatch,
					})
					dispatch(closeDialog())
				})
		}
	};

	if (submitingAnswer || editingAnswer) {
		return <BackdropLoading />
	}

	return (
		<div className=' w-xl'>
			<DialogTitle >{qna.title}</DialogTitle>
			<DialogContent className='flex flex-col gap-8'>
				{/* {!qna.closed &&
					qna.status === 'VERIFIED' && (
						<TextField
							disabled={qna?.closed}
							label='My answer'
							placeholder='Enter answer for the question...'
							variant='outlined'
							value={answer}
							onChange={(
								event: ChangeEvent<HTMLInputElement>
							) => {
								setAnswer(
									event.target.value
								);
							}}
							multiline
							minRows={4}
							fullWidth
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					)} */}
				<div>{RenderHTML(qna.content)}</div>
				<Divider />
				<QuillEditor
					value={answer}
					onChange={setAnswer}
					// error={errors.content?.message}
					label={editMode ? "Edit your answer" : "Answer the question"}
					placeholder='Write your answer...'
				/>
			</DialogContent>
			<DialogActions>
				<Button
					variant='contained'
					color='secondary'
					className='m-8'
					disabled={
						submitingAnswer
						|| !answer.length
						|| !validateHTML(answer)
					}
					onClick={() =>
						handleAnswerQuestion()
					}
				>
					Submit Answer
				</Button>
			</DialogActions>
		</div>
	)
}
