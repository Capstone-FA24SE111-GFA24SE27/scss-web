import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCounselorQuestionQuery } from '../qna-api';
import { ContentLoading } from '@/shared/components';
import { useAppDispatch } from '@shared/store';
import ChatBox from '@/shared/components/chat/ChatBox';
import { setChatSession } from '@/shared/components/chat';

const ConversationDetail = () => {
  const routeParams = useParams();
  const { id: questionCardId } = routeParams as { id: string };
  const navigate = useNavigate()
  const { data: qnaData, isFetching} = useGetCounselorQuestionQuery(questionCardId)
  const qna = qnaData?.content
  
  if (isFetching) {
    return <ContentLoading />;
  }

  if(!qna.chatSession) {
    navigate(-1)
  }

  return (
    <ChatBox qna={qna} />
  )
}

export default ConversationDetail