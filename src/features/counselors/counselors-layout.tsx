import { AppLayout } from '@shared/layouts'
import {  useGetMyCounselorQuestionsQuery } from './qna/qna-api'
import useChatNotification from '@/shared/components/chat/useChatNotification'
import Counselors from './Counselors';
const CounselorsLayout = () => {

  const { data: qnaData, refetch, isLoading } = useGetMyCounselorQuestionsQuery({})
  const qnaList = qnaData?.content?.data

	useChatNotification(qnaList);


  return (
    <AppLayout>
      <Counselors />
    </AppLayout>
  );
}

export default CounselorsLayout