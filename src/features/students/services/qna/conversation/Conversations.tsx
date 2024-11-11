import {  InputAdornment, Typography } from '@mui/material';
import React, { useState } from 'react';
import { TextField } from '@mui/material';
import {  useGetMyStudentQuestionsQuery} from '../qna-api';
import {  Search } from '@mui/icons-material';
import { useNavigate} from 'react-router-dom';
import { Scrollbar } from '@/shared/components';
import { useEffect } from 'react'
import { Question } from '@/shared/types';
import ConversationItem from './ConversationItem';

const Conversation = () => {
  const { data: qnaData, refetch } = useGetMyStudentQuestionsQuery({})
  const qnaList = qnaData?.content?.data.filter(item => item.status === 'VERIFIED') || []

  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSelectChat = (qnaItem: Question) => {
    navigate(`${qnaItem.id}`)
  }

  useEffect(() => {
    refetch()
  }, []);

  return (
    <div className='flex flex-1 w-full h-full'>
      <Scrollbar className='p-16 space-y-16 w-full !h-[calc(100vh-65px)]'>
        <Typography className='text-3xl font-extrabold '>Conversations</Typography>
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
            <ConversationItem key={qnaItem.id} onClick={() => handleSelectChat(qnaItem)} qnaItem={qnaItem}/>
          ))}
        </div>
      </Scrollbar>
    </div>
  );
};

export default Conversation;