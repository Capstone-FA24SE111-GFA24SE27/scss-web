import React from 'react'
import { Outlet } from 'react-router-dom'
import { AppLayout } from '@shared/layouts'
import {  useGetMyCounselorQuestionsQuery } from './qna/qna-api'
import useChatNotification from '@/shared/components/chat/useChatNotification'
import { AppLoading } from '@/shared/components'
const CounselorsLayout = () => {

  const { data: qnaData, refetch, isLoading } = useGetMyCounselorQuestionsQuery({})
  const qnaList = qnaData?.content?.data

	useChatNotification(qnaList);


  return (
    <AppLayout>
        <Outlet />
    </AppLayout>
  )
}

export default CounselorsLayout