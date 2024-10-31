import {
	CheckCircleOutlineOutlined,
	HelpOutlineOutlined,
	Send,
} from '@mui/icons-material';
import {
	Avatar,
	IconButton,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	useGetStudentQuestionQuery,
	useReadMessageMutation,
	useSendMessageMutation,
} from '../qna-api';
import { ContentLoading, Scrollbar } from '@/shared/components';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import { useSocket } from '@/shared/context';
import { formatDateTime } from '@/shared/utils';
import { Message } from '@/shared/types';
import QnaList from '../QnaList';
import { closeChatSession, setChatSessionId } from '@/shared/components/chat';

const ConversationDetail = () => {
	const routeParams = useParams();
	const { id: questionCardId } = routeParams as { id: string };
	const socket = useSocket();
	const account = useAppSelector(selectAccount);
	const messagesRef = useRef<HTMLDivElement>(null);
	const myId = account.id;
	const {
		data: qnaData,
		isFetching,
		refetch,
	} = useGetStudentQuestionQuery(questionCardId);
	const qna = qnaData?.content;
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState<Message[]>([]);
	const dispatch = useAppDispatch();
	console.log('Messages: ', messages);
	const [sendMessage] = useSendMessageMutation();
	const [readMessage] = useReadMessageMutation();
	const handleSendMessage = () => {
		sendMessage({
			sessionId: qna?.chatSession.id,
			content: message,
		});
		setMessage('');
	};

 

	useEffect(() => {
		if (qnaData) {
			
			setMessages(qnaData?.content.chatSession?.messages);
			dispatch(setChatSessionId(qna.chatSession.id));
		}
	}, [qnaData]);

  useEffect(()=>{
    if (messagesRef && messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  },[messages])

	useEffect(() => {
		const cb = (data: Message) => {
			console.log('QnA Message: ', data);
			setMessages((prevMessages) => [...prevMessages, data]);
      
			if (data.sender.id !== account.id && !data.read) {
				readMessage(qna?.chatSession.id);
			}
		};

		if (socket) {
			socket.on(`/user/${qna?.chatSession.id}/chat`, cb);
		}

		return () => {
			if (socket) {
				socket.off(`/user/${qna?.chatSession.id}/chat`);
			}
      dispatch(closeChatSession())
		};
	}, [socket, qna]);

	useEffect(() => {
		refetch();
	}, []);

	if (isFetching) {
		return <ContentLoading />;
	}

	if (!qnaData) {
		return (
			<div className='flex items-center justify-center flex-1'>
				<Typography color='text.secondary' variant='h5'>
					There are no data!
				</Typography>
			</div>
		);
	}
	return (
		<div className='relative flex flex-col'>
			<div className='p-16 py-20 space-y-8 bg-background-paper'>
				<div className='flex items-center gap-16'>
					<Avatar
						src={qna?.student.profile.avatarLink}
						alt='Student image'
					/>
					<Typography variant='h6' className='font-semibold'>
						{qna?.student.profile.fullName}
					</Typography>
				</div>
				<div className='flex items-center flex-1 gap-8'>
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
				className='p-16 m-8 rounded space-y-8 bg-background min-h-0 overflow-y-auto !h-[calc(100vh-265px)]'
			>
				{messages.map((message, index) => (
					<div
						key={message.id}
						className={`flex ${
							message.sender.id === myId
								? 'justify-end'
								: 'justify-start'
						}`}
					>
						<div>
							<Paper
								className={`p-16 text-white ${
									message.sender.id === myId
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
								className={`mt-4 text-sm ${
									message.sender.id === myId
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

			<div className='bottom-0 flex items-center w-full p-16 bg-background-paper'>
				<TextField
					fullWidth
					variant='outlined'
					label='Message'
					size='small'
					placeholder='Type a message'
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
					<Send />
				</IconButton>
			</div>
		</div>
	);
};

export default ConversationDetail;
