import { Avatar, Input, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useGetMyQuestionsQuery } from '../qna-api';
import dayjs from 'dayjs';
import { Search } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';

const Conversation = () => {
  const { data: qnaData } = useGetMyQuestionsQuery({})
  const qnaList = qnaData?.content?.data || []
  const chatSessions = qnaData?.content?.data.map(qna => qna.chatSession)

  const [messages, setMessages] = useState([{ sender: 'them', text: 'What is the Capital of France!' }]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();
  const sendMessage = () => {
    if (input) {
      setMessages([...messages, { sender: 'me', text: input }]);
      setInput('');
    }
  };

  return (
    <div className='flex h-full'>
      <div className='border-r w-sm bg-background-paper p-16 space-y-16'>
        <Typography className='text-3xl font-extrabold'>Conversations</Typography>
        <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40 rounded-full shadow-none">
          <Search />
          <Input
            placeholder="Search or start new chat"
            className="flex flex-1 px-8"
            disableUnderline
            fullWidth
            inputProps={{
              'aria-label': 'Search'
            }}
          />
        </Paper>
        <div className="space-y-8 ">
          {qnaList.map((qnaItem) => (
            <div key={qnaItem.id} className="flex items-center gap-8 p-8 cursor-pointer hover:bg-primary-main/5 rounded"
              onClick={() => navigate(`${qnaItem?.id}`)}
            >
              <Avatar src={qnaItem.student.profile.avatarLink} alt='Student image' />
              <div className="ml-4 w-full">
                <div className='flex justify-between items-center'>
                  <Typography className="text-lg font-semibold">{qnaItem.student.profile.fullName}</Typography>
                  <Typography className="text-sm text-text-disabled">{dayjs(qnaItem?.chatSession?.lastInteractionDate).format('YYYY-MM-DD')}</Typography>
                </div>
                <p className="text-sm text-primary-light line-clamp-1">{qnaItem.chatSession?.messages?.at(-1)?.content || qnaItem.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div>

  );
};

export default Conversation;