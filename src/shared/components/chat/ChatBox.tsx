import {
	Avatar,
	Button,
	IconButton,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Scrollbar } from '../scrollbar';
import {
	CheckCircleOutlineOutlined,
	HelpOutlineOutlined,
	Send,
} from '@mui/icons-material';
import { Message, Question } from '@/shared/types';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { formatDateTime } from '@/shared/utils';
import { useReadMessageMutation, useSendMessageMutation } from './chat-api';
import {
	closeChatSession,
	selectChatListeners,
	selectCurrentChatMessages,
	selectPassiveChatCallback,
	setChatSession,
	setChatSessionId,
} from './chats-slice';
import useThrottle from '@/shared/hooks/useThrottle';
import { ContentLoading } from '../loading';
import { useSocket } from '@/shared/context';
import { openCounselorView } from '@/features/students/students-layout-slice';
import { openStudentView } from '@/features/counselors/counselors-layout-slice';
import { roles } from '@/shared/constants';

type Props = {
	qna: Question;
};

const ChatBox = (props: Props) => {
	const { qna } = props;

	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [sendMessage] = useSendMessageMutation();
	const [readMessage] = useReadMessageMutation();

	const socket = useSocket();
	const chatListeners = useAppSelector(selectChatListeners);
	const account = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const passiveCallback = useAppSelector(selectPassiveChatCallback);

	const handleSendMessage = useThrottle(() => {
		sendMessage({
			sessionId: qna?.chatSession?.id,
			content: message,
		});
		setMessage('');
	}, 500);

	const handleViewUser = () => {
		account.role === roles.STUDENT
			? dispatch(openCounselorView(qna?.counselor?.id.toString()))
			: dispatch(openStudentView(qna?.student?.id.toString()))
	}

	useEffect(() => {
		if (qna) {
			dispatch(setChatSessionId(qna.chatSession?.id));
			setMessages(qna.chatSession?.messages)
			// console.log(qna.chatSession?.messages)

			if (qna.chatSession?.messages.length > 0) {
				const latestMessage = qna.chatSession?.messages[qna.chatSession?.messages.length - 1];
				// console.log('latest',latestMessage)
				if (latestMessage.sender.id !== account.id && !latestMessage.read) {
					try {
						readMessage(qna.chatSession?.id);
					} catch (e) {
						console.log(e)
					}
				}
			}
		}

		return () => {
			dispatch(closeChatSession());
		};
	}, [qna]);

	useEffect(() => {
		// console.log('chat box', qna, socket, chatListeners, passiveCallback);
		if (!qna.closed && socket && chatListeners && passiveCallback) {
			// console.log('asdawd2');
			if (chatListeners.findIndex(item => item.chatSession.id === qna.chatSession.id) > -1) {
				// console.log('asdawd3	');
				socket.off(`/user/${qna.chatSession.id}/chat`);
				const cb = (data: Message) => {
					if (data.sender.id !== account.id && !data.read) {
						readMessage(data.chatSessionId);
						let message = data;
						message.read = true;

						setMessages((prev) => [...prev, message]);
					} else {
						setMessages((prev) => [...prev, data]);
					}
				};

				socket.on(`/user/${qna.chatSession?.id}/chat`, cb);
				// console.log(`active /user/${qna.chatSession?.id}/chat`)
			}

			return () => {
				socket.off(`/user/${qna.chatSession?.id}/chat`);
				if (
					!qna.closed &&
					chatListeners.findIndex(item => item.chatSession.id === qna.chatSession.id) > -1 &&
					passiveCallback
				) {
					socket.on(
						`/user/${qna.chatSession?.id}/chat`, (data) =>
						passiveCallback(data, qna)
					);
					// console.log(`resume passive /user/${qna.chatSession?.id}/chat`)
				}
			};
		}
	}, [socket, chatListeners, qna, passiveCallback]);

	// scroll down when new message
	useEffect(() => {
		if (messagesRef && messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages, messagesRef, account]);

	let otherPerson = null;
	if (qna.counselor) {
		otherPerson = qna.counselor;
	} else {
		otherPerson = qna.student;
	}

	return (
		<div className='relative flex flex-col w-full h-full min-w-320'>
			<div className='p-16 space-y-8 bg-background-paper'>
				<Button className='flex items-center gap-16' onClick={handleViewUser}>
					<Avatar
						src={otherPerson?.profile.avatarLink}
						alt='Student image'
					/>
					<Typography variant='h6' className='font-semibold'>
						{otherPerson?.profile.fullName}
					</Typography>
				</Button>
				<div className='flex items-center flex-1 gap-8 pl-16'>
					{/* <Divider orientation='vertical' /> */}
					{qna.answer ? (
						<CheckCircleOutlineOutlined color='success' />
					) : (
						<HelpOutlineOutlined color='disabled' />
					)}
					<Typography className='w-full pr-8 font-semibold'>
						{qna?.content}
					</Typography>
				</div>
			</div>
			<Scrollbar
				ref={messagesRef}
				className='flex-grow p-16 pb-96 space-y-4 overflow-y-auto !h-[calc(100vh-265px)]'
			>
				{messages?.map((message, index) => (
					<div
						key={message.id}
						className={`flex ${message.sender.id === account.id
							? 'justify-end'
							: 'justify-start'
							}`}
					>
						<div>
							<Paper
								className={`p-16 text-white ${message.sender.id === account.id
									? 'bg-secondary-main text-white'
									: 'bg-primary-main'
									}`}
							>
								{message.content}
								{/* {message.sentAt} -
                  {message.read? 'read': 'not read'} */}
							</Paper>
							<Typography
								color='textSecondary'
								className={`mt-4 text-sm ${message.sender.id === account.id
									? 'text-end'
									: 'text-start'
									} `}
							>
								{formatDateTime(message.sentAt)}
							</Typography>
						</div>
					</div>
				))}
			</Scrollbar>
			{qna.closed ? (
				<div className='p-16 font-semibold text-center bg-secondary-main/10 text-secondary-main'>
					Question has been closed
				</div>
			) : (
				<div className='absolute bottom-0 flex items-center w-full gap-16 p-16 bg-background-paper'>
					<TextField
						fullWidth
						variant='outlined'
						label='Message'
						placeholder='Type a message'
						autoComplete='off'
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter' && message) {
								handleSendMessage();
							}
						}}
					/>
					<IconButton
						color='primary'
						onClick={handleSendMessage}
						disabled={!message}
					>
						<Send fontSize='large' />
					</IconButton>
				</div>
			)}
		</div>
	);
};

export default ChatBox;
