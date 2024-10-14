import { Avatar, Chip, Divider, Input, Paper, Typography } from '@mui/material';
import React, { useState } from 'react';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Question, useGetMyQuestionsQuery, useReadMessageMutation } from '../qna-api';
import dayjs from 'dayjs';
import { Search } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { Scrollbar } from '@/shared/components';
import { selectAccount, useAppSelector } from '@shared/store';
import { useEffect } from 'react'

const Conversation = () => {
  const { data: qnaData, refetch } = useGetMyQuestionsQuery({})
  const qnaList = qnaData?.content?.data.filter(item => item.counselor) || []
  const account = useAppSelector(selectAccount)

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
    <div className='flex h-full'>
      <Scrollbar className=' p-16 space-y-16 border-r !h-[calc(100vh-65px)]'>
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
            <div key={qnaItem.id} >
              <div className="flex items-center gap-8 p-4 cursor-pointer hover:bg-primary-main/5 rounded"
                onClick={() => handleSelectChat(qnaItem)}
              >
                <Avatar src={qnaItem?.counselor?.profile.avatarLink} alt='Cousenlor image' />
                <div className="ml-4 w-full space-x-4">
                  <div className='flex justify-between items-center'>
                    <Typography className="font-semibold line-clamp-1">{qnaItem?.counselor?.profile.fullName}</Typography>
                    {/* <Typography className="text-sm text-text-disabled">{dayjs(qnaItem?.chatSession?.lastInteractionDate).format('YYYY-MM-DD')}</Typography> */}
                  </div>
                  <div className='flex justify-between items-center'>
                    <div className="text-sm text-primary-light line-clamp-1">{qnaItem.chatSession?.messages?.at(-1)?.content || qnaItem.content}</div>
                    <Chip label={countUnreadMessages(qnaItem)} size='small' color='secondary'/>
                  </div>
                </div>
              </div>
              <Divider />
            </div>

          ))}

        </div>
      </Scrollbar>
      <Outlet />
    </div>

  );
};

export default Conversation;