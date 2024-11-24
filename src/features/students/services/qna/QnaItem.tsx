import { NavLinkAdapter, UserLabel } from '@/shared/components';
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
} from '@mui/material';
import { Question } from '@/shared/types';
import {
	useCloseQuestionStudentMutation,
	useCreateChatSessionStudentMutation,
	useDeleteQuestionStudentMutation,
} from './qna-api';
import { useNavigate } from 'react-router-dom';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { statusColor } from '@/shared/constants';
import { useGetMessagesQuery } from '@/shared/components/chat/chat-api';
import { openCounselorView } from '../../students-layout-slice';
import { useAlertDialog } from '@/shared/hooks';
import { useConfirmDialog } from '@/shared/hooks';

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

	const { data, isLoading } = useGetMessagesQuery(qna.id,  {skip: !qna || qna.closed || !qna.chatSession || qna.status !== 'VERIFIED'});
	const chatSession = data?.content;

	const dispatch = useAppDispatch();

	const navigate = useNavigate();
	const account = useAppSelector(selectAccount);

	const [closeQuestion] = useCloseQuestionStudentMutation();
	const [deleteQuestion, { isLoading: isDeletingQuestion }] =
		useDeleteQuestionStudentMutation();
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
				confirmButtonFunction: async ()=>{
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
					<AccordionSummary expandIcon={<ExpandMore />}>
						<div className='flex flex-col gap-8'>
							<div className='flex gap-8'>
								<Chip
									label={
										qna.questionType === 'ACADEMIC'
											? 'Academic'
											: 'Non-Academic'
									}
									color={'info'}
									size='small'
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

					<AccordionDetails className='flex'>
						<div className='flex flex-col gap-8'>
							{
								qna.counselor && (
									<UserLabel
										label='Assigned to'
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
								// <Button className='flex items-center justify-start gap-16 px-16 w-fit'>
								//   <Avatar
								//     className='size-32'
								//     alt={qna.counselor?.profile.fullName}
								//     src={qna.counselor?.profile.avatarLink} />
								//   <div>
								//     <Typography className='text-sm font-semibold'>{qna.counselor?.profile.fullName}</Typography>
								//     <Typography className='text-sm text-start' color='textSecondary'>{qna.counselor?.expertise?.name || qna.counselor?.specialization?.name}</Typography>
								//   </div>
								// </Button>
							}
							{!qna.counselor ? (
								<Typography
									className='px-8 italic'
									color='textDisabled'
								>
									{'No counselor has taken this question'}
								</Typography>
							) : qna.answer ? (
								<div>
									{/* <Typography className='px-8 text-sm italic' color='textDisabled'>Answered at 4:20 11/10/2024</Typography> */}
									<Typography className='px-8'>
										{qna.answer}
									</Typography>
								</div>
							) : (
								<div>
									<Typography
										className='px-8 italic'
										color='textDisabled'
									>
										{'The counselor has not answer yet'}
									</Typography>
								</div>
							)}
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
						) : qna.status == 'VERIFIED' && !qna?.closed ? (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Close />}
								onClick={() => handleCloseQuestion()}
							>
								Close
							</Button>
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
								Initiate Chat
							</Button>
						)}
					</Box>
				</Accordion>
			</Paper>
		</motion.div>
	);
};

export default QnaItem;
