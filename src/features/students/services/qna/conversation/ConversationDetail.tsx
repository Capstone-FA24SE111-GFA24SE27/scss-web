import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useGetStudentQuestionQuery } from '../qna-api';
import { ContentLoading} from '@/shared/components';
import ChatBox from '@/shared/components/chat/ChatBox';

const ConversationDetail = () => {
  const routeParams = useParams();
  const { id: questionCardId } = routeParams as { id: string };
  const { data: qnaData, isFetching } = useGetStudentQuestionQuery(questionCardId)
  const qna = qnaData?.content


  if (isFetching) {
    return <ContentLoading />;
  }

  return (
    <ChatBox qna={qna}/>
  )
}

export default ConversationDetail