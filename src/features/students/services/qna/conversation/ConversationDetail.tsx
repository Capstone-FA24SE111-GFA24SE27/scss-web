import { CheckCircleOutlineOutlined, HelpOutlineOutlined, Send } from '@mui/icons-material'
import { Avatar, IconButton, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Message, useGetQuestionQuery, useReadMessageMutation, useSendMessageMutation } from '../qna-api';
import { ContentLoading, Scrollbar } from '@/shared/components';
import { selectAccount, useAppSelector } from '@shared/store';
import { useSocket } from '@/shared/context';
import { formatChatDate } from '@/shared/utils';

const ConversationDetail = () => {
  const routeParams = useParams();
  const { id: questionCardId } = routeParams as { id: string };
  const socket = useSocket()
  const account = useAppSelector(selectAccount)
  const myId = account.id
  const { data: qnaData, isFetching } = useGetQuestionQuery(questionCardId)
  const qna = qnaData?.content
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  console.log("Messages: ", messages)
  const [sendMessage] = useSendMessageMutation()
  const [readMessage] = useReadMessageMutation()
  const handleSendMessage = () => {
    sendMessage({
      sessionId: qna?.chatSession.id,
      content: message,
    })
    setMessage('')
  }

  useEffect(() => {
    if (qnaData) {
      setMessages(qnaData?.content.chatSession?.messages)
    }
  }, [qnaData]);

  useEffect(() => {

    const cb = (data: Message) => {
      console.log('QnA Message: ', data)
      setMessages((prevMessages) => [...prevMessages, data])
      if (data.sender.id !== account.id && !data.read) {
        readMessage(qna?.chatSession.id)
      }
    };

    if (socket) {
      socket.on(`/user/${qna?.chatSession.id}/chat`, cb);
    }

    return () => {
      if (socket) {
        socket.off(`/user/${qna?.chatSession.id}/chat`);
      }
    };
  }, [socket, qna]);


  if (isFetching) {
    return <ContentLoading />;
  }

  if (!qnaData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Typography
          color="text.secondary"
          variant="h5"
        >
          There are no messages!
        </Typography>
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full relative">
      <div className='bg-background-paper p-16 space-y-8'>
        <div className='flex gap-16 items-center'>
          <Avatar src={qna?.student.profile.avatarLink} alt='Student image' />
          <Typography variant="h6" className='font-semibold'>{qna?.student.profile.fullName}</Typography>
        </div>
        <div className="flex flex-1 items-center gap-8">
          {
            qna.answer
              ? <CheckCircleOutlineOutlined color='success' />
              : <HelpOutlineOutlined color='disabled' />
          }
          <Typography className="pr-8 font-semibold w-full">{qna?.content}</Typography>
        </div>
      </div>

      <div className="p-16 space-y-8 bg-background min-h-0 overflow-y-auto h-[calc(100vh-265px)]">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex ${message.sender.id === myId ? 'justify-end' : 'justify-start'
              }`}
          >
            <div>

              <Paper
                className={`p-16 text-white ${message.sender.id === myId ? 'bg-secondary-main text-white' : 'bg-primary-main'
                  }`}
              >
                {message.content}
                {/* {message.sentAt} -
{message.read? 'read': 'not read'} */}
              </Paper>
              <Typography color='textSecondary' className={`mt-4 text-sm ${message.sender.id === myId ? 'text-end' : 'text-start'} `}>{formatChatDate(message.sentAt)}</Typography>
            </div>
          </div>

        ))}
      </div>


      <div className="flex items-center w-full bg-background-paper p-16 bottom-0">
        <TextField
          fullWidth
          variant="outlined"
          label="Message"
          size='small'
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendMessage} disabled={!message}>
          <Send />
        </IconButton>
      </div>
    </div>
  )
}

export default ConversationDetail