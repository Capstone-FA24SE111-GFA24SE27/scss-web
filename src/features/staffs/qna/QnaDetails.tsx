import {
	ContentLoading,
	NavLinkAdapter,
	openDialog,
	selectDialogProps,
} from '@/shared/components';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { useAppDispatch, useAppSelector } from '@shared/store';
import useConfirmDialog from '@/shared/hooks/form/useConfirmDialog';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import QnaFlagForm from './QnaFlagFormDialog';

const QnaDetails = () => {
	const routeParams = useParams();
	const { id: qnaId } = routeParams as { id: string };
	const { data, isLoading } = useGetQuestionQuery(qnaId, { skip: !qnaId });
	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

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

	const handleNavigateBack = () => {};

	const handleLocalNavigate = (route: string) => {
		const pathSegments = location.pathname.split('/').filter(Boolean);

		// Create a new path using the first two segments
		const newPath = `/${pathSegments[0]}/${route}`;

		return newPath;
	};

	const handleVerify = () => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to verify this question?',
			confirmButtonFucntion: async () => {
				const result = await reviewQuestion({
					id: qna.id,
					status: 'VERIFIED',
				});
				useAlertDialog({
					title: result.data.message,
					dispatch: dispatch,
				});
				if (result.data.status === 200) {
					navigate(-1);
				}
			},
		});
	};

	const handleReject = () => {
		useConfirmDialog({
			dispatch: dispatch,
			title: 'Are you sure you want to reject this question?',
			confirmButtonFucntion: async () => {
				const result = await reviewQuestion({
					id: qna.id,
					status: 'REJECTED',
				});
				if (result?.data?.status === 200) {
					useAlertDialog({
						title: 'Question is rejected successfully',
						dispatch: dispatch,
					});
					navigate(-1);
				} else {
					useAlertDialog({
						title: result.data.message,
						dispatch: dispatch,
					});
				}
			},
		});
	};

	const handleFlag = () => {
		dispatch(openDialog({
			children: <QnaFlagForm qna={qna}/>
		}))
	};

	return (
		<div className='relative w-full h-full p-16 '>
			<div className='w-full h-full pb-32 bg-background-paper'>
				<Typography className='pt-16 pb-32 pr-32 text-xl font-semibold leading-none'>
					Question Details
				</Typography>

				<div className='flex flex-col gap-16'>
					<div className='flex gap-8'>
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
						<Typography className='text-lg font-semibold'>
							Content
						</Typography>
						<Typography className=''>{qna.content}</Typography>
					</div>
					<div>
						<Typography className='text-lg font-semibold'>
							Enquirer
						</Typography>
						<Tooltip
							title={`View ${qna.student.profile.fullName}'s profile`}
						>
							<ListItemButton
								component={NavLinkAdapter}
								to={handleLocalNavigate(
									`student/${qna.student.profile.id}`
								)}
								className='w-full rounded shadow cursor-default bg-primary-light/5'
							>
								<div className='flex items-start w-full gap-16'>
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
						<Typography className='text-lg font-semibold'>
							Informant
						</Typography>

						{qna.counselor ? (
							<Tooltip
								title={`View ${qna.counselor.profile.fullName}'s profile`}
							>
								<ListItemButton
									component={NavLinkAdapter}
									to={handleLocalNavigate(
										`student/${qna.counselor.profile.id}`
									)}
									className='w-full rounded shadow bg-primary-light/5'
								>
									<div
										className='flex items-start w-full gap-16'
									>
										<Avatar
											alt={qna.counselor.profile.fullName}
											src={qna.counselor.profile.avatarLink}
										/>
										<div>
											<Typography className='font-semibold text-primary-main'>
												{qna.counselor.profile.fullName}
											</Typography>
											<Typography color='text.secondary'>
												{qna.counselor.email ||
													'emailisnull.edu.vn'}
											</Typography>
										</div>
									</div>
									<ChevronRight />
								</ListItemButton>
							</Tooltip>
						) : (
							<div className='flex items-center gap-4'>
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
			<Typography className='text-lg font-semibold'>Action</Typography>
			<div className='sticky bottom-0 left-0 flex w-full gap-16'>
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
