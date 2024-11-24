import {
	ExpandableText,
	NavLinkAdapter,
	openDialog,
	UserLabel,
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
	HelpOutlineOutlined,
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
	usePostReviewQuestionStatusMutation,
} from '../qna-api';
import { Question } from '@/shared/types';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { openStudentView } from '../../counselors-layout-slice';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';
import QnaFlagForm from './QnaFlagFormDialog';
import { statusColor } from '@/shared/constants';
import { useGetMessagesQuery } from '@/shared/components/chat/chat-api';

const container = {
	show: {
		transition: {
			staggerChildren: 0.04,
		},
	},
};

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

	const [answer, setAnswer] = useState('');

	const [editedAnswer, setEditedAnswer] = useState(qna.answer || '');

	const [editMode, setEditMode] = useState(false);

	const [answerQuestion, { isLoading: submitingAnswer }] =
		useAnswerQuestionMutation();

	const [editAnswer, { isLoading: editingAnswer }] =
		useAnswerQuestionMutation();

	const [closeQuestion] = useCloseQuestionCounselorMutation();
	const [reviewQuestion] = usePostReviewQuestionStatusMutation();

	const handleAnswerQuestion = (questionId: number) => {
		answerQuestion({
			questionCardId: questionId,
			content: answer,
		});
	};

	const editAnswerQuestion = (questionId: number) => {
		editAnswer({
			questionCardId: questionId,
			content: editedAnswer,
		});
		setAnswer(editedAnswer);
		setEditedAnswer(editedAnswer || '');
		setEditMode(false);
	};

	const handleSelectChat = () => {
		navigate(`/qna/conversations/${qna.id}`);
	};

	const handleChat = () => {
		navigate(`${qna.id}`);
	};

	const handleRejectQuestion = (id: number) => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to reject this question?',
			confirmButtonFunction: async () => {
				const result = await reviewQuestion({
					id: id,
					status: 'REJECTED',
				});
				if (result?.data?.status === 200) {
					useAlertDialog({
						title: 'Question is rejected successfully',
						dispatch: dispatch,
					});
					setExpanded(false);
				} else {
					useAlertDialog({
						title: result.data.message,
						dispatch: dispatch,
					});
				}
			},
		});
	};

	const handleCloseQuestion = async () => {
		useConfirmDialog({
			title: 'Are you sure you want to close the question?',
			confirmButtonFunction: async () => {
				const result = await closeQuestion(qna.id);
				console.log('close qna', result);
				if (result?.data?.status === 200) {
					useAlertDialog({
						title: result.data.message,
						dispatch,
					});
					setExpanded(false);
				} else {
					useAlertDialog({
						title: result.data.message,
						dispatch: dispatch,
					});
				}
			},
			dispatch,
		});
	};

	const handleFlagQuestion = (id: number) => {
		dispatch(
			openDialog({
				children: <QnaFlagForm id={id} />,
			})
		);
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
					expanded={expanded === qna.id || expanded === true}
					onChange={toggleAccordion(qna.id)}
				>
					<AccordionSummary expandIcon={<ExpandMore />} className=''>
						<div className='flex flex-col gap-8'>
							<div className='flex gap-8'>
								<Chip
									label={qna.status}
									color={statusColor[qna.status as string]}
									size='small'
								/>
								{/* <Chip label={qna.topic?.name} size='small' /> */}
								{/* {qna.taken && <Chip label={`Taken by ${qna?.counselor.profile.fullName}`} variant='outlined' color={'success'} size='small' />} */}
								{qna.closed && (
									<Chip
										label={'Closed'}
										variant='outlined'
										color={'error'}
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
							<div className='flex items-center flex-1 gap-8'>
								{/* <Divider orientation='vertical' /> */}
								{qna.answer ? (
									<CheckCircleOutlineOutlined color='success' />
								) : (
									<HelpOutlineOutlined color='disabled' />
								)}

								<Typography className='w-full pr-8 font-semibold'>
									{qna.content}
								</Typography>
							</div>
						</div>
					</AccordionSummary>

					<AccordionDetails className='flex flex-col justify-start gap-16'>
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
						<div className='flex flex-col w-full gap-8 mt-4'>
							{qna.answer ? (
								editMode ? (
									<div>
										<TextField
											label='My answer'
											placeholder='Enter a keyword...'
											variant='outlined'
											value={editedAnswer}
											onChange={(
												event: ChangeEvent<HTMLInputElement>
											) => {
												setEditedAnswer(
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
										<div className='flex justify-end w-full gap-8'>
											<Button
												variant='outlined'
												className='mt-8'
												color='primary'
												size='small'
												onClick={() =>
													setEditMode(false)
												}
											>
												Cancel
											</Button>
											<Button
												variant='contained'
												color='secondary'
												className='mt-8'
												size='small'
												disabled={
													editingAnswer ||
													!editedAnswer.length ||
													editedAnswer == answer
												}
												onClick={() =>
													editAnswerQuestion(qna.id)
												}
											>
												Submit
											</Button>
										</div>
									</div>
								) : (
									<div>
										{/* <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
										<Typography className='font-semibold'>
											My answer:{' '}
										</Typography>
										<div className='flex flex-wrap items-center gap-8'>
											<ExpandableText
												className='flex flex-wrap w-full overflow-hidden break-all text-wrap'
												text={qna.answer}
												limit={100}
											/>
											{!qna.closed && (
												<IconButton
													size='small'
													onClick={() =>
														setEditMode(true)
													}
												>
													<EditNote />
												</IconButton>
											)}
										</div>
									</div>
								)
							) : (
								<div>
									{!qna.closed &&
										qna.status === 'VERIFIED' && (
											<>
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
												<div className='flex justify-end w-full'>
													<Button
														variant='contained'
														color='secondary'
														className='mt-8'
														size='small'
														disabled={
															submitingAnswer ||
															!answer.length
														}
														onClick={() =>
															handleAnswerQuestion(
																qna.id
															)
														}
													>
														Submit
													</Button>
												</div>
											</>
										)}
								</div>
							)}
						</div>
					</AccordionDetails>
					<Box className='flex justify-end w-full gap-16 px-16 py-8 bg-primary-light/5'>
						{!qna?.closed && qna?.answer && (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Close />}
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
									color='primary'
									startIcon={<Close />}
									onClick={() => {
										handleFlagQuestion(qna.id);
									}}
								>
									Flag Question
								</Button>
							)}
						{!qna?.answer &&
							!qna.closed &&
							(qna.status === 'PENDING' ||
								qna.status === 'VERIFIED') && (
								<Button
									variant='outlined'
									color='secondary'
									startIcon={<Close />}
									onClick={() => {
										handleRejectQuestion(qna.id);
									}}
								>
									Reject Question
								</Button>
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
