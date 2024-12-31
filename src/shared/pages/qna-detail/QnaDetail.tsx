import {
	ContentLoading,
	NavLinkAdapter,
	RenderHTML,
	UserListItem,
	openDialog,
	selectDialogProps,
} from '@/shared/components';
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	useGetCounselorQnaDetailQuery,
	usePostFlagQuestionStatusMutation,
	usePostReviewQuestionStatusMutation,
} from './qna-detail-api';
import {
	Avatar,
	Button,
	Chip,
	ListItemButton,
	Rating,
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
import { useConfirmDialog } from '@/shared/hooks';
import { useAlertDialog } from '@/shared/hooks';
import QnaFlagForm from './QnaFlagFormDialog';
import { statusColor } from '@/shared/constants';
import { Question } from '@/shared/types';
import dayjs from 'dayjs';

const QnaDetail = ({ id, questionCard }: { id?: number, questionCard?: Question }) => {
	const routeParams = useParams();
	const { id: qnaRouteId } = routeParams as { id: string };
	const qnaId = id || qnaRouteId
	const { data, isLoading } = useGetCounselorQnaDetailQuery(qnaId?.toString(), { skip: !qnaId || questionCard !== undefined });
	const [reviewQuestion] = usePostReviewQuestionStatusMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	if (isLoading) {
		return <ContentLoading />;
	}

	const qna = questionCard || data?.content;

	if (!qna) {
		return <Typography className=''>No question found </Typography>;
	}

	const handleNavigateBack = () => { };

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
			confirmButtonFunction: async () => {
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
			confirmButtonFunction: async () => {
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
			children: <QnaFlagForm qna={qna} />
		}))
	};

	return (
		<div className='relative w-full h-full p-16 min-w-sm'>
			<div className='w-full h-full pb-32 bg-background-paper'>
				<Typography className='pt-16 pb-32 pr-32 text-3xl font-semibold leading-none'>
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
							label={qna.status?.toLowerCase()}
							color={
								statusColor[qna.status] as
								| 'error'
								| 'default'
								| 'warning'
								| 'success'
							}
							size='small'
							className='capitalize'
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
							Title
						</Typography>
						<Typography className=''>{RenderHTML(qna.title)}</Typography>
					</div>
					<div>
						<Typography className='text-lg font-semibold'>
							Content
						</Typography>
						<Typography className=''>{RenderHTML(qna.content)}</Typography>
					</div>
					<div>
						<Typography className='text-lg font-semibold'>
							Answer
						</Typography>
						<Typography className=''>{RenderHTML(qna.answer)}</Typography>
					</div>
					<div className='flex flex-col gap-32'>
						<div className='flex flex-col flex-1 gap-8 rounded'>
							<Typography className="text-lg font-semibold text-primary-light">
								Asker
							</Typography>
							<div
								className='flex justify-start gap-16 rounded'
							>

								<UserListItem
									fullName={qna.student.profile.fullName}
									avatarLink={qna.student.profile.avatarLink}
									phoneNumber={qna.student.profile.phoneNumber}
									email={qna.student.email}
								/>
							</div>
						</div>
						<div className='flex flex-col flex-1 gap-8 rounded'>
							<Typography className="text-lg font-semibold text-primary-light">
								Answerer
							</Typography>
							<div
								className='flex justify-start gap-16 rounded'
							>
								<UserListItem
									fullName={qna.counselor.profile.fullName}
									avatarLink={qna.counselor.profile.avatarLink}
									phoneNumber={qna.counselor.profile.phoneNumber}
									email={qna.counselor.email}
								/>
							</div>
						</div>
					</div>
					{
						qna.feedback && <div className='flex flex-col items-start gap-8 mt-8'>
							<Typography className='text-lg font-semibold '>Feedback:</Typography>
							<div className='flex-1'>
								<div className='flex-1'>
									<div className='flex items-center gap-8'>
										<Rating
											size='medium'
											value={qna.feedback.rating}
											readOnly
										/>
										<Typography color='text.secondary'>{dayjs(qna.feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Typography>
									</div>
								</div>
								<Typography className='pl-4 mt-8' sx={{ color: 'text.secondary' }}>{qna.feedback.comment}</Typography>
							</div>
						</div>
					}
				</div>
			</div>

		</div >
	);
};

export default QnaDetail;
