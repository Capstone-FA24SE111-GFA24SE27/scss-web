import { NavLinkAdapter } from '@/shared/components';
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
	useDeleteQuestionStudentMutation,
} from './qna-api';
import { useNavigate } from 'react-router-dom';
import { selectAccount, useAppSelector } from '@shared/store';
import { statusColor } from '@/shared/constants';
import {  useGetMessagesQuery} from '@/shared/components/chat/chat-api';

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

    const {data, isLoading} = useGetMessagesQuery(qna.id)

	console.log(qna)
    const chatSession = data?.content

	const navigate = useNavigate();
	const account = useAppSelector(selectAccount);

	const [closeQuestion] = useCloseQuestionStudentMutation();
	const [deleteQuestion, { isLoading: isDeletingQuestion }] =
		useDeleteQuestionStudentMutation();

	const handleSelectChat = (qna: Question) => {
		navigate(`conversations/${qna.id}`);
	};

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
								<div>Id: {qna.id}</div>
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
									<div className='flex items-center px-32 text-sm'>
										Answered by
										<Button
											className='flex items-center gap-8 ml-4'
											component={NavLinkAdapter}
											to={`counselor/${qna?.counselor?.profile?.id}`}
										>
											<Avatar
												className='size-24'
												alt={
													qna.counselor?.profile
														.fullName
												}
												src={
													qna.counselor?.profile
														.avatarLink
												}
											/>
											<div>
												<Typography className='font-semibold'>
													{
														qna.counselor?.profile
															.fullName
													}
												</Typography>
											</div>
										</Button>
									</div>
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
						{qna.status == 'PENDING' ? (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Delete />}
								disabled={isDeletingQuestion}
								onClick={() => deleteQuestion(qna.id)}
							>
								Delete
							</Button>
						) : qna.status == 'VERIFIED' && !qna?.closed ? (
							<Button
								variant='outlined'
								color='secondary'
								startIcon={<Close />}
								onClick={() => closeQuestion(qna.id)}
							>
								Close
							</Button>
						) : (
							<></>
						)}
						{qna.status == 'PENDING' ? (
							<Button
								variant='contained'
								color='secondary'
								component={NavLinkAdapter}
								to={`edit/${qna.id}`}
								startIcon={<Edit />}
							>
								Edit
							</Button>
						) : (
							<Button
								variant='contained'
								color='secondary'
								startIcon={<ChatBubbleOutline />}
								onClick={() => handleSelectChat(qna)}
								disabled={!qna.counselor}
							>
								Chat
							</Button>
						)}
					</Box>
				</Accordion>
			</Paper>
		</motion.div>
	);
};

export default QnaItem;
