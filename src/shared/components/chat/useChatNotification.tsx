import { useSocket } from '@/shared/context';
import { Message, Question } from '@/shared/types';
import { useAppSelector } from '@shared/store';
import React, { useEffect } from 'react';
import { selectOpenedChatId } from './chats-slice';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import ChatNotificationTemplate from './ChatNotificationTemplate';

const useChatNotification = (qnaList: Question[]) => {
	const socket = useSocket();
	const currentChatId = useAppSelector(selectOpenedChatId);

    console.log('sdawd', qnaList)

	useEffect(() => {
		if (socket && qnaList.length > 0) {
			const cb = (data: Message, qna: Question) => {

				if (currentChatId !== qna.chatSession.id) {
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
				}
			};

			qnaList.forEach((qnaItem) => {
				if (
					qnaItem.status === 'VERIFIED' &&
					qnaItem.answer &&
					!qnaItem.closed
				) {
					socket.on(`/user/${qnaItem.chatSession.id}/chat`, (data) =>
						cb(data, qnaItem)
					);
				}
			});
		}
		return () => {
            if(socket && qnaList.length > 0)
			qnaList.forEach((qnaItem) => {
				if (qnaItem.status === 'VERIFIED' && qnaItem.answer) {
					socket.off(`/user/${qnaItem.chatSession.id}/chat`);
				}
			});
		};
	}, [socket, qnaList, currentChatId]);

	return null;
};

export default useChatNotification;
