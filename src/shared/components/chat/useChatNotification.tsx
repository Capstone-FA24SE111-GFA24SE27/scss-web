import { useSocket } from '@/shared/context';
import { Message, Question } from '@/shared/types';
import { selectAccount, useAppDispatch, useAppSelector } from '@shared/store';
import React, { useEffect } from 'react';
import {
	chatSessionSlice,
	clearChatListeners,
	selectChatListeners,
	selectOpenedChatId,
	setChatListeners,
	setPassiveChatCallback,
} from './chats-slice';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import ChatNotificationTemplate from './ChatNotificationTemplate';
import { studentQnasApi } from '@/features/students/services/qna/qna-api';
import { counselorQnaApi } from '@/features/counselors/qna/qna-api';
import { chatApi } from './chat-api';

const useChatNotification = (qnaList: Question[]) => {
	const socket = useSocket();
	const currentChatId = useAppSelector(selectOpenedChatId);
	const dispatch = useAppDispatch();
	const account = useAppSelector(selectAccount);
	const chatListeners = useAppSelector(selectChatListeners);

	useEffect(() => {
		if (socket && qnaList && qnaList.length > 0) {
			const cb = (data: Message, qna: Question) => {
				console.log('current chat', currentChatId);
				enqueueSnackbar(data.content, {
					key: data.id,
					autoHideDuration: 5000,
					anchorOrigin: {
						horizontal: 'left',
						vertical: 'bottom',
					},
					content: (
						<ChatNotificationTemplate
							item={data}
							qna={qna}
							onClose={() => {
								closeSnackbar(data.id);
							}}
						/>
					),
				});
				dispatch(chatApi.util.invalidateTags(['chat']));
				// if(account.role === 'STUDENT'){
				// 	dispatch(studentQnasApi.util.invalidateTags(['qna']))
				// } else {
				// 	dispatch(counselorQnaApi.util.invalidateTags(['qna']))
				// }
			};

			dispatch(setPassiveChatCallback(cb));

			let listenersList = new Set<number>();

			console.log(qnaList)

			qnaList.forEach((qnaItem) => {
				if (
					qnaItem.status === 'VERIFIED' &&
					qnaItem.answer &&
					!qnaItem.closed
				) {
					const result = socket.on(
						`/user/${qnaItem.chatSession.id}/chat`,
						(data) => cb(data, qnaItem)
					);
					console.log(
						`passive /user/${qnaItem.chatSession.id}/chat`,
						result
					);
					listenersList.add(qnaItem.chatSession.id);
				}
			});

			dispatch(setChatListeners(listenersList));
		}
		return () => {
			if (socket && chatListeners) {
				chatListeners.forEach((id) => {
					socket.off(`/user/${id}/chat`);
				});
				dispatch(clearChatListeners());
			}
		};
	}, [socket, qnaList]);

	return null;
};

export default useChatNotification;
