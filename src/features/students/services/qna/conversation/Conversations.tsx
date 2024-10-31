import { Avatar, Chip, Divider, Input, InputAdornment, ListItemButton, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {  useGetMyStudentQuestionsQuery, useReadMessageMutation } from '../qna-api';
import dayjs from 'dayjs';
import { CheckCircleOutlineOutlined, HelpOutlineOutlined, Search } from '@mui/icons-material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { Scrollbar } from '@/shared/components';
import { selectAccount, useAppSelector } from '@shared/store';
import { useEffect } from 'react'
import { Question } from '@/shared/types';

const Conversation = () => {
  const { data: qnaData, refetch } = useGetMyStudentQuestionsQuery({})
  const qnaList = qnaData?.content?.data.filter(item => item.counselor) || []
  const account = useAppSelector(selectAccount)

  const { id } = useParams()

  const [messages, setMessages] = useState([{ sender: 'them', text: 'What is the Capital of France!' }]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const [readMessage] = useReadMessageMutation()

  const countUnreadMessages = (qnaItem: Question) => {
    const readMessages = qnaItem?.chatSession?.messages.filter((message) => message.sender.id !== account.id && !message.read)
    return readMessages?.length
  }

  const handleSelectChat = (qnaItem: Question) => {
    readMessage(qnaItem.chatSession.id)
    navigate(`${qnaItem.id}`)
  }

  useEffect(() => {
    refetch()
  }, []);

  return (
    <div className='flex w-full h-full'>
      <Scrollbar className='p-16 space-y-16 w-full !h-[calc(100vh-65px)]'>
        <Typography className='text-3xl font-extrabold'>Conversations</Typography>
        <TextField 
          variant="outlined"
          label="Search conversations"
          placeholder="Name"
          value={input}
          fullWidth
          onChange={(e) => setInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <div className="space-y-8 ">
          {qnaList.map((qnaItem) => (
            <ListItemButton key={qnaItem.id} className='flex-col items-start p-4 rounded' selected={Number(id) == qnaItem.id}
              onClick={() => handleSelectChat(qnaItem)}
            >
              <Tooltip title={qnaItem.content}>
                <div className="flex items-center flex-1 gap-8">
                  {
                    qnaItem.answer
                      ? <CheckCircleOutlineOutlined color='success' />
                      : <HelpOutlineOutlined color='disabled' />
                  }
                  <Typography className="w-full pr-8 font-semibold line-clamp-1">{qnaItem?.content}</Typography>
                </div>
              </Tooltip>
              <div className="flex items-center w-full gap-8 p-8"
              >
                <Avatar src={qnaItem.student.profile.avatarLink} alt='Student image' />
                <div className="w-full ml-4">
                  <div className='flex items-center justify-between'>
                    <Typography className="text-lg font-semibold">{qnaItem.student.profile.fullName}</Typography>
                    {/* <Typography className="text-sm text-text-disabled">{dayjs(qnaItem?.chatSession?.lastInteractionDate).format('YYYY-MM-DD')}</Typography> */}
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className="flex-1 text-sm text-primary-light line-clamp-1">{qnaItem.chatSession?.messages?.at(-1)?.content || qnaItem.content}</div>
                    {countUnreadMessages(qnaItem) ? <Chip label={countUnreadMessages(qnaItem)} size='small' color='secondary' /> : ''}
                  </div>
                </div>
              </div>
              <Divider />
            </ListItemButton>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default Conversation;