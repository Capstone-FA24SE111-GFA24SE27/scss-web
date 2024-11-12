import { NavLinkAdapter, PageSimple } from '@/shared/components';
import { Close } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import {  useGetMyCounselorQuestionsQuery } from './qna/qna-api'
import useChatNotification from '@/shared/components/chat/useChatNotification'
import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { closeStudentView, selectStudentView } from './counselors-layout-slice';
import { StudentView } from '@/shared/pages';
const Counselors = () => {
  const dispatch = useAppDispatch()
  const isMobile = false
  const studentView = useAppSelector(selectStudentView)
  const isOpenStudentView = Boolean(studentView)

  const { data: qnaData, refetch, isLoading } = useGetMyCounselorQuestionsQuery({})
  const qnaList = qnaData?.content?.data

	useChatNotification(qnaList);

  return (
    <PageSimple
      content={<Outlet />}
      rightSidebarContent={
        <div className="flex flex-col flex-auto max-w-full w-fit">
          <IconButton
            className="absolute top-0 right-0 z-10 mx-32 my-16"
            onClick={ () => { dispatch(closeStudentView()) }}
            size="large"
          >
            <Close />
          </IconButton>
          {
            studentView && <StudentView id={studentView} />
          }
        </div>
      }
      rightSidebarOpen={isOpenStudentView}
      rightSidebarOnClose={() => { dispatch(closeStudentView()) }}
      rightSidebarVariant="temporary"
      scroll={isMobile ? 'normal' : 'content'}
    />
  );
}

export default Counselors