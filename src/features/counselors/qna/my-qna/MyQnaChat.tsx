import React, { useEffect} from 'react'
import { useParams } from 'react-router-dom';
import { useGetCounselorQuestionQuery} from '../qna-api';
import { ContentLoading, Scrollbar } from '@/shared/components';
import { useAppDispatch } from '@shared/store';
import { setChatSession } from '@/shared/components/chat';
import ChatBox from '@/shared/components/chat/ChatBox';

const MyQnaChat = () => {
  const routeParams = useParams();
  const { id: questionCardId } = routeParams as { id: string };
  const { data: qnaData, isFetching } = useGetCounselorQuestionQuery(questionCardId)
  const qna = qnaData?.content
  

  if (isFetching) {
    return <ContentLoading />;
  }

  return (
    <ChatBox qna={qna} />
  )
}

export default MyQnaChat