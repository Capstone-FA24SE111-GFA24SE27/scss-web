import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppLayout } from '@shared/layouts';
import { useAppDispatch } from '@shared/store';
import { openDialog } from '@/shared/components';
import { useGetStudentDocumentQuery } from './students-api';
import { useGetMyStudentQuestionsQuery } from './services/qna/qna-api';
import { Question } from '@/shared/types';
import useChatNotification from '@/shared/components/chat/useChatNotification';
import { StudentDocument } from './students-components';
import Students from './Students';

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

	useChatNotification(useGetMyStudentQuestionsQuery);

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
			<Students />
		</AppLayout>
	);
};

export default StudentLayout;
