import { ContentLoading } from '@/shared/components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetQuestionQuery } from './qna-api';
import { Typography } from '@mui/material';

const QnaDetails = () => {
	const routeParams = useParams();
	const { id: qnaId } = routeParams as { id: string };
	const { data, isLoading } = useGetQuestionQuery(qnaId, { skip: !qnaId });

	if (isLoading) {
		return <ContentLoading />;
	}

	const qna = data.content;

	if (!qna) {
		return <Typography className=''>No question found </Typography>;
	}

	return (
		<div>
			<div className='flex flex-col w-full p-16 pb-32 bg-background-paper'>
				<Typography className='pt-16 pr-32 text-xl font-semibold leading-none'>
					Question Details
				</Typography>
				
			</div>
		</div>
	);
};

export default QnaDetails;
