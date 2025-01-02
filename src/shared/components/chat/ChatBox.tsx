import {
	Avatar,
	Button,
	IconButton,
	Input,
	LinearProgress,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Scrollbar } from '../scrollbar';
import {
	CheckCircleOutlineOutlined,
	HelpOutlineOutlined,
	InsertPhoto,
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
import ChatApp from './Demo';
import { uploadFile } from '@/shared/services';
import ChatMessage from './ChatMessage';

type Props = {
	qna: Question;
};

const ChatBox = (props: Props) => {
	const { qna } = props;

	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const messagesRef = useRef<HTMLDivElement>(null);
	const [sendMessage, { isLoading: isSendingMessage }] = useSendMessageMutation();
	const [readMessage] = useReadMessageMutation();
	const [uploadProgress, setUploadProgress] = useState(0);
	const isUploadingImage = uploadProgress > 0 && uploadProgress < 100
	const socket = useSocket();
	const chatListeners = useAppSelector(selectChatListeners);
	const account = useAppSelector(selectAccount);
	const dispatch = useAppDispatch();
	const passiveCallback = useAppSelector(selectPassiveChatCallback);
	const isStudent = account.role === roles.STUDENT
	const handleSendMessage = useThrottle(() => {
		sendMessage({
			sessionId: qna?.chatSession?.id,
			content: message,
		});
		setMessage('');
	}, 500);


	const handleImageUpload = () => {
		const input = document.createElement("input");
		input.setAttribute("type", "file");
		input.setAttribute("accept", "image/*");
		input.click();

		input.onchange = async () => {
			if (input && input.files && input.files[0]) {
				const file = input.files[0];
				const path = `images/${Date.now()}_${file.name}`;

				try {
					const downloadURL = await uploadFile(file, path, (progress) => {
						setUploadProgress(progress);
					});

					await sendMessage({
						sessionId: qna?.chatSession?.id,
						content: downloadURL as string,
					});
				} catch (error) {
					console.error("Image upload failed:", error);
				}
			}
		};
	}

	const handleViewUser = () => {
		isStudent
			? dispatch(openCounselorView(qna?.counselor?.id.toString()))
			: dispatch(openStudentView(qna?.student?.id.toString()))
	}

	useEffect(() => {
		if (qna) {
			dispatch(setChatSessionId(qna.chatSession?.id));
			setMessages(qna.chatSession?.messages)

			if (qna.chatSession?.messages.length > 0) {
				const latestMessage = qna.chatSession?.messages[qna.chatSession?.messages.length - 1];
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
			// dispatch(closeChatSession());
		};
	}, [qna]);

	useEffect(() => {
		if (!qna.closed && socket && chatListeners && passiveCallback) {
			if (chatListeners.findIndex(item => item.chatSession?.id === qna.chatSession?.id) > -1) {
				socket.off(`/user/${qna.chatSession?.id}/chat`);
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
			}

			return () => {
				socket.off(`/user/${qna.chatSession?.id}/chat`);
				if (
					!qna.closed &&
					chatListeners.findIndex(item => item.chatSession?.id === qna.chatSession?.id) > -1 &&
					passiveCallback
				) {
					socket.on(
						`/user/${qna.chatSession?.id}/chat`, (data) =>
						passiveCallback(data, qna)
					);
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

	const otherPerson = isStudent ? qna?.counselor : qna?.student;

	return (
		<div className='relative flex flex-col w-full h-full min-w-320'>
			<div className='p-16 space-y-8 bg-background-paper'>
				<Button className='flex items-center gap-16' onClick={handleViewUser}>
					<Avatar
						src={otherPerson?.profile.avatarLink}
						alt='Student image'
					/>
					<div>
						<Typography variant='h6' className='font-semibold'>
							{otherPerson?.profile.fullName}
						</Typography>
						{/* <Typography className=''>
							{otherPerson?.profile.fullName}
						</Typography> */}
					</div>
				</Button>
				<div className='flex items-center flex-1 gap-8 pl-16'>
					{/* <Divider orientation='vertical' /> */}
					{/* {qna.answer ? (
						<CheckCircleOutlineOutlined color='success' />
					) : (
						<HelpOutlineOutlined color='disabled' />
					)} */}
					<HelpOutlineOutlined color='disabled' />
					<Typography className='w-full pr-8 font-semibold'>
						{qna?.title}
					</Typography>
				</div>
			</div>
			<Scrollbar
				ref={messagesRef}
				className='flex-grow p-16 pb-96 mx-8 space-y-4 overflow-y-auto !h-[calc(100vh-196px)] bg-background '
			>
				{messages?.map((message, index) => (
					<div
						key={message.id}
						className={`flex ${message.sender.id === account.id
							? 'justify-end'
							: 'justify-start'
							}`}
					>
						<ChatMessage message={message} uploadProgress={uploadProgress} />
					</div>
				))}
				{
					isUploadingImage &&
					(
						<div className='w-full flex justify-end'>
							<div className='text-white max-w-384'>
								<img src={`/assets/images/placeholders/uploading-image.jpeg`} alt="Message content" className='rounded-lg' />
								<div className="w-full mt-16">
									<Typography color='secondary'>Uploading image...</Typography>
									<LinearProgress variant="determinate" value={uploadProgress} color="secondary" />
								</div>
							</div>
						</div>
					)
				}
			</Scrollbar>
			{qna.closed ? (
				<div className='p-16 font-semibold text-center text-white bg-secondary-light absolute bottom-8 w-full'>
					Question has been closed
				</div>
			) : (
				<>
					<div className='absolute bottom-0 flex items-center w-full gap-4 p-8 bg-background-paper'>
						<IconButton onClick={handleImageUpload} color="primary" disabled={isUploadingImage}>
							<InsertPhoto />
						</IconButton>
						{/* <TextField
							fullWidth
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
							size='small'
							className='rounded-full'
						/> */}
						<Paper
							className={"flex items-center gap-16 px-12 rounded-full shadow-none border-2 w-full"}
						>
							<Input
								fullWidth
								placeholder='Type your message'
								autoComplete='off'
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && message) {
										handleSendMessage();
									}
								}}
								size='small'
								className={"flex w-full gap-8 pl-8"}
								disableUnderline
							/>
						</Paper>
						<IconButton
							color='secondary'
							onClick={handleSendMessage}
							disabled={!message}
						>
							<Send fontSize='large' />
						</IconButton>
					</div>
				</>

			)}
		</div>
	);
};

export default ChatBox;


