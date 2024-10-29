import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { AppLayout } from '@shared/layouts'
import { useAppDispatch } from '@shared/store'
import { openDialog } from '@/shared/components'
import { useGetStudentDocumentQuery } from './students-api'
import { StudentDocument } from './components'
const StudentLayout = () => {
  const dispatch = useAppDispatch()
  const { data: studentDocumentData } = useGetStudentDocumentQuery()
  const studentCounselingDocument = studentDocumentData?.content?.counselingProfile
  console.log(studentDocumentData?.content)
  useEffect(() => {
    if (studentDocumentData && !studentCounselingDocument)
      dispatch(openDialog({
        children: <StudentDocument />
      })
      )
  }, [studentDocumentData]);
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  )
}

export default StudentLayout