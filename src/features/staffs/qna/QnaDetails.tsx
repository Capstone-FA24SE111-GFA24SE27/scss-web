import { ContentLoading, NavLinkAdapter } from '@/shared/components';
import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
	useGetQuestionQuery,
	usePostFlagQuestionStatusMutation,
	usePostReviewQuestionStatusMutation,
} from './qna-api';
import {
	Avatar,
	Button,
	Chip,
	ListItemButton,
	Tooltip,
	Typography,
} from '@mui/material';
import {
	CheckCircle,
	ChevronRight,
	Error,
	Flag,
	RemoveCircle,
} from '@mui/icons-material';

const QnaDetails = () => {
	const routeParams = useParams();
	const { id: qnaId } = routeParams as { id: string };
	const { data, isLoading } = useGetQuestionQuery(qnaId, { skip: !qnaId });
	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const [flagQuestion] = usePostFlagQuestionStatusMutation();

	if (isLoading) {
		return <ContentLoading />;
	}

	const qna = data?.content;

	if (!qna) {
		return <Typography className=''>No question found </Typography>;
	}

	const statusColor = {
		PENDING: 'warning',
		VERIFIED: 'success',
		FLAGGED: 'error',
		REJECTED: 'error',
	};

	const handleVerify = () => {
		reviewQuestion({ id: qna.id, status: 'VERIFIED' });
	};

	const handleReject = () => {
		reviewQuestion({ id: qna.id, status: 'REJECTED' });
	};

	const handleFlag = () => {
		flagQuestion({ id: qna.id });
	};

	return (
		<div className='relative w-full h-full p-16 '>
			<div className='w-full pb-32 bg-background-paper h-full'>
				<Typography className='pt-16 pr-32 pb-32 text-xl font-semibold leading-none'>
					Question Details
				</Typography>

				<div className='flex flex-col gap-16'>
					<div className='gap-8 flex'>
						<Chip
							label={
								qna.questionType === 'ACADEMIC'
									? 'Academic'
									: 'Non-Academic'
							}
							color={
								qna.questionType === 'ACADEMIC'
									? 'info'
									: 'warning'
							}
							size='small'
						/>
						<Chip
							label={qna.status}
							color={
								statusColor[qna.status] as
									| 'error'
									| 'default'
									| 'warning'
									| 'success'
							}
							size='small'
						/>
						{qna.closed && (
							<Chip
								label={'Closed'}
								color={'warning'}
								size='small'
							/>
						)}
					</div>
					<div>
						<Typography className='font-semibold text-lg'>
							Content
						</Typography>
						<Typography className=''>{qna.content}</Typography>
					</div>
					<div>
						<Typography className='font-semibold text-lg'>
							Enquirer
						</Typography>
						<Tooltip
							title={`View ${qna.student.profile.fullName}'s profile`}
						>
							<ListItemButton
								// component={NavLinkAdapter}
								// to={handleLocalNavigate(`student/${qna.student.profile.id}`)}
								className='w-full rounded shadow bg-primary-light/5'
							>
								<div
									// onClick={handleNavClicked}
									className='flex items-start w-full gap-16'
								>
									<Avatar
										alt={qna.student.profile.fullName}
										src={qna.student.profile.avatarLink}
									/>
									<div>
										<Typography className='font-semibold text-primary-main'>
											{qna.student.profile.fullName}
										</Typography>
										<Typography color='text.secondary'>
											{qna.student.email ||
												'emailisnull.edu.vn'}
										</Typography>
									</div>
								</div>
								<ChevronRight />
							</ListItemButton>
						</Tooltip>
					</div>
					<div>
						<Typography className='font-semibold text-lg'>
							Informant
						</Typography>

						{qna.counselor ? (
							<Tooltip
								title={`View ${qna.student.profile.fullName}'s profile`}
							>
								<ListItemButton
									// component={NavLinkAdapter}
									// to={handleLocalNavigate(`student/${qna.student.profile.id}`)}
									className='w-full rounded shadow bg-primary-light/5'
								>
									<div
										// onClick={handleNavClicked}
										className='flex items-start w-full gap-16'
									>
										<Avatar
											alt={qna.student.profile.fullName}
											src={qna.student.profile.avatarLink}
										/>
										<div>
											<Typography className='font-semibold text-primary-main'>
												{qna.student.profile.fullName}
											</Typography>
											<Typography color='text.secondary'>
												{qna.student.email ||
													'emailisnull.edu.vn'}
											</Typography>
										</div>
									</div>
									<ChevronRight />
								</ListItemButton>
							</Tooltip>
						) : (
							<div className='flex gap-4 items-center'>
								<Error />
								<Typography
									className='font-medium'
									color='text.secondary'
								>
									No one has accepted this question yet
								</Typography>
							</div>
						)}
					</div>
				</div>
			</div>
			<Typography className='font-semibold text-lg'>Action</Typography>
			<div className='w-full sticky bottom-0 left-0 flex gap-16'>
				<Button
					className='flex items-center gap-4'
					onClick={handleVerify}
				>
					<CheckCircle color='success' />
					Verify
				</Button>
				<Button
					className='flex items-center gap-4'
					onClick={handleReject}
				>
					<RemoveCircle color='warning' />
					Reject
				</Button>
				<Button
					className='flex items-center gap-4'
					onClick={handleFlag}
				>
					<Flag color='error' />
					Flag
				</Button>
			</div>
		</div>
	);
};

export default QnaDetails;
