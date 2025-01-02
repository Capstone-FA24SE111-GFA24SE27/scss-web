import { AppLayout } from '@shared/layouts'

import Counselors from './Counselors';
import { counselorQnaApi, useGetMyCounselorQuestionsQuery } from './qna/qna-api';
import useChatNotification from '@/shared/components/chat/useChatNotification';
import { useQuestionsSocketListener } from '@/shared/context';
import { selectAccount, useAppSelector } from '@shared/store';
const CounselorsLayout = () => {

  const account = useAppSelector(selectAccount)
  const { data: qnaData, refetch, isLoading } = useGetMyCounselorQuestionsQuery({})
  const qnaList = qnaData?.content?.data
  useChatNotification(qnaList);

  
  // useQuestionsSocketListener(account?.profile.id, refetch)  

  return (
    <AppLayout>
      <Counselors />
    </AppLayout>
  );
}

export default CounselorsLayout