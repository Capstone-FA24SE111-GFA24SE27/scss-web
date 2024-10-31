import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '@shared/layouts';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';
import { useGetStudentDocumentQuery } from './students-api';
import { StudentDocument } from './components';
import { useGetMyStudentQuestionsQuery } from './services/qna/qna-api';
import { Question } from '@/shared/types';
import useChatNotification from '@/shared/components/chat/useChatNotification';
const StudentLayout = () => {
	const dispatch = useAppDispatch();
	const { data: studentDocumentData } = useGetStudentDocumentQuery();

	const {
		data: qnaData,
		refetch,
		isLoading,
	} = useGetMyStudentQuestionsQuery({});

	const qnaList = qnaData?.content?.data || ([] as Question[]);


	const studentCounselingDocument =
		studentDocumentData?.content?.counselingProfile;
	console.log(studentDocumentData?.content);

	useChatNotification(qnaList);

	useEffect(() => {
		if (studentDocumentData && !studentCounselingDocument)
			dispatch(
				openDialog({
					children: <StudentDocument />,
				})
			);
	}, [studentDocumentData]);
	return (
		<AppLayout>
			<Outlet />
		</AppLayout>
	);
};

export default StudentLayout;
