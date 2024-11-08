import { Avatar, Chip, Divider, Input, ListItemButton, Paper, Tooltip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useGetMyCounselorQuestionsQuery } from '../qna-api';
import { CheckCircleOutlineOutlined, HelpOutlineOutlined, Search } from '@mui/icons-material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { selectAccount, useAppSelector } from '@shared/store';
import { useEffect } from 'react'
import { Scrollbar } from '@/shared/components';
import { Question } from '@/shared/types';

const Conversation = () => {
  const { data: qnaData, refetch } = useGetMyCounselorQuestionsQuery({})
  const qnaList = qnaData?.content?.data || []
  const account = useAppSelector(selectAccount)

  const { id } = useParams()

  const navigate = useNavigate();
  const countUnreadMessages = (qnaItem: Question) => {
    const readMessages = qnaItem?.chatSession?.messages.filter((message) => message.sender.id !== account.id && !message.read)
    return readMessages?.length
  }
  const handleSelectChat = (qnaItem: Question) => {
    navigate(`${qnaItem.id}`)
  }

  useEffect(() => {
    refetch()
  }, []);

  return (
    <div className='flex h-full w-full'>
      <div className='p-16 space-y-16 border-r bg-background-paper'>
        <Typography className='text-3xl font-extrabold'>Conversations</Typography>
        {/* <Paper className="flex items-center w-full h-40 p-4 px-16 py-4 rounded-full shadow-none border-1">
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
        </Paper> */}
        <Scrollbar className="space-y-8 overflow-y-auto !h-[calc(100vh-212px)]">
          {qnaList.map((qnaItem) => (
            <ListItemButton key={qnaItem.id} className='flex-col items-start rounded' selected={Number(id) == qnaItem.id}
              onClick={() => handleSelectChat(qnaItem)}
            >
              <Tooltip title={qnaItem.content}>
                <div className="flex items-center flex-1 gap-8">
                  {/* <Divider orientation='vertical' /> */}
                  {
                    qnaItem.answer
                      ? <CheckCircleOutlineOutlined color='success' />
                      : <HelpOutlineOutlined color='disabled' />
                  }
                  <Typography className="w-full pr-8">{qnaItem?.content}</Typography>
                </div>
              </Tooltip>
              <div className="flex items-center w-full gap-8 p-8">
                <Avatar src={qnaItem.student.profile.avatarLink} alt='Student image' />
                <div className="w-full ml-4">
                  <div className='flex items-center justify-between'>
                    <Typography className="text-lg font-semibold">{qnaItem.student.profile.fullName}</Typography>
                    {/* <Typography className="text-sm text-text-disabled">{dayjs(qnaItem?.chatSession?.lastInteractionDate).format('YYYY-MM-DD')}</Typography> */}
                  </div>
                  <div className='flex items-center justify-between flex-1 w-full'>
                    <div className="flex-1 text-sm text-primary-light line-clamp-1">{qnaItem.chatSession?.messages?.at(-1)?.content || qnaItem.content}</div>
                    {countUnreadMessages(qnaItem) ? <Chip label={countUnreadMessages(qnaItem)} size='small' color='secondary' /> : ''}
                  </div>
                </div>
              </div>
              <Divider />
            </ListItemButton>
          ))}
        </Scrollbar>
      </div>
      <Outlet />
    </div >

  );
};

export default Conversation;