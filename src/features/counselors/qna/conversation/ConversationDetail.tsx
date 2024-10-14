import { CheckCircleOutlineOutlined, HelpOutlineOutlined, Send } from '@mui/icons-material'
import { Avatar, IconButton, Paper, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Message, useGetQuestionQuery } from '../qna-api';
import { ContentLoading, Scrollbar } from '@/shared/components';
import { selectAccount, useAppSelector } from '@shared/store';
import { useSocket } from '@/shared/context';
import { useSendMessageMutation } from '@/features/students/services/qna/qna-api';

const ConversationDetail = () => {
  const routeParams = useParams();
  const { id: questionCardId } = routeParams as { id: string };
  const socket = useSocket()
  const account = useAppSelector(selectAccount)
  const myId = account.id
  const { data: qnaData, isFetching } = useGetQuestionQuery(questionCardId)
  const qna = qnaData?.content
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  console.log(messages)

  const [sendMessage] = useSendMessageMutation()

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

  // const sendMessage = () => {
  //   if (input) {
  //     setMessages([...messages, { sender: 'me', text: input }]);
  //     setInput('');
  //   }
  // };

  if (isFetching) {
    return <ContentLoading />;
  }

  if (!qnaData) {
    return (
      <div className="flex flex-1 items-center justify-center w-md">
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
    <div className="flex flex-col relative w-full">
      <div className='bg-background-paper p-16 space-y-8'>
        <div className='flex gap-16 items-center'>
          <Avatar src={qna?.student.profile.avatarLink} alt='Student image' />
          <Typography variant="h6" className='font-semibold'>{qna?.student.profile.fullName}</Typography>
        </div>
        <div className="flex flex-1 items-center gap-8">
          {/* <Divider orientation='vertical' /> */}
          {
            qna.answer
              ? <CheckCircleOutlineOutlined color='success' />
              : <HelpOutlineOutlined color='disabled' />
          }
          <Typography className="pr-8 font-semibold w-full">{qna?.content}</Typography>
        </div>
      </div>
      <Scrollbar className="flex-grow p-16 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender.id === myId ? 'justify-end' : 'justify-start'
              }`}
          >
            <Paper
              className={`px-16 py-8 text-white ${message.sender.id === myId ? 'bg-secondary-main text-white' : 'bg-primary-main'
                }`}
            >
              {message.content}
            </Paper>
          </div>
        ))}
      </Scrollbar>
      <div className="flex items-center w-full gap-16 bg-background-paper p-16 absolute bottom-0">
        <TextField
          fullWidth
          variant="outlined"
          label="Message"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <IconButton color="primary" onClick={handleSendMessage} disabled={!message}>
          <Send fontSize='large' />
        </IconButton>
      </div>
    </div>
  )
}

export default ConversationDetail