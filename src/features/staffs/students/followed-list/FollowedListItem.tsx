import React from 'react';
import {
	FollowedDTOType,
	useGetStudentFollowStatusQuery,
	useUnfollowStudentStaffMutation,
} from './staff-followed-student-api';
import {
	ExpandableText,
	ItemMenu,
	NavLinkAdapter,
	openDialog,
	UserLabel,
	UserListItem,
} from '@/shared/components';
import EditIcon from '@mui/icons-material/Edit';
import {
	Chip,
	ListItem,
	ListItemButton,
	Paper,
	Tooltip,
	Typography,
} from '@mui/material';
import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import { AccessTime, Add, ChevronRight, Visibility } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import BookmarkRemoveIcon from '@mui/icons-material/BookmarkRemove';
import dayjs from 'dayjs';
import useAlertDialog from '@/shared/hooks/form/useAlertDialog';
import { getApiErrorMessage, isApiError, useAppDispatch } from '@shared/store';
import UpdateFollowNoteForm from './UpdateFollowNoteForm';
import { useConfirmDialog } from '@/shared/hooks';

type Props = {
	item: FollowedDTOType;
};

const FollowedListItem = (props: Props) => {
	const { item } = props;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const [unfollowStudent] = useUnfollowStudentStaffMutation();

	const handleView = () => {};

	const handleCreateDemand = () => {
		navigate(`/students/create-demand/${item.student.id}`);
	};

	const handleUnfollow = () => {
		useConfirmDialog({
			dispatch,
			title: `Are your sure you want to unfollow ${item?.student.profile.fullName}?`,
			confirmButtonFunction: () => {
				unfollowStudent(item.student.id)
					.unwrap()
					.then((result) => {
						console.log('awdas', result);
						if (result) {
							useAlertDialog({
								title: result,
								confirmButtonTitle: 'Ok',
								dispatch,
							});
						}
					})
					.catch((err) => console.log(err));
			},
		});
	};

	const handleUpdateFollowNote = () => {
		dispatch(
			openDialog({
				children: (
					<UpdateFollowNoteForm
						studentId={item.student.id}
						followNote={item.followNote}
					/>
				),
			})
		);
	};

	if (!item) {
		return <Typography>Invalid Item!</Typography>;
	}

	return (
		<Paper
			className='flex gap-16 p-16 shadow'
			sx={{ bgcolor: 'background.paper' }}
		>
			<div className='flex flex-col justify-center w-full gap-16'>
				<ListItem
					className='flex gap-8 px-0'
					secondaryAction={
						<ItemMenu
							menuItems={[
								// {
								// 	label: 'View Detail',
								// 	icon: <Visibility fontSize='small' />,
								// 	onClick: () => {
								// 		navigate(``);
								// 	},
								// },
								{
									label: 'Create Demand',
									icon: <Add fontSize='small' />,
									onClick: () => {
										handleCreateDemand();
									},
								},
								{
									label: 'Update Follow Note',
									icon: <EditIcon fontSize='small' />,
									onClick: () => {
										handleUpdateFollowNote();
									},
								},
								{
									label: 'Unfollow',
									icon: (
										<BookmarkRemoveIcon fontSize='small' />
									),
									onClick: () => {
										handleUnfollow();
									},
								},
							]}
						/>
					}
				>
					{item.followDate && (
						<div className='flex items-center gap-8'>
							<AccessTime />
							<Typography className='font-semibold'>
								Followed since
							</Typography>
							<Typography>
								{dayjs(item.followDate).format('HH:mm')},
							</Typography>
							<Typography>
								{dayjs(item.followDate).format('YYYY-MM-DD')}
							</Typography>
						</div>
					)}
				</ListItem>

				<Tooltip
					title={`View ${item.student.profile.fullName}'s profile`}
				>
					<ListItemButton
						component={NavLinkAdapter}
						to={`student/${item.student.id}`}
						className='w-full rounded shadow bg-primary-light/5'
					>
						<UserListItem
							fullName={item.student.profile.fullName}
							avatarLink={item.student.profile.avatarLink}
							phoneNumber={item.student.profile.phoneNumber}
							email={item.student.email}
						/>
						<ChevronRight />
					</ListItemButton>
				</Tooltip>

				{/* <div className='flex gap-8'>
						<Typography className='w-96' color='textSecondary'>
							Summarize:
						</Typography>
						<ExpandableText
							text={item.summarizeNote}
							limit={144}
						/>
					</div> */}

				<div className='flex gap-8'>
					<Typography className='w-48' color='textSecondary'>
						Note:
					</Typography>
					<ExpandableText text={item.followNote} limit={144} />
				</div>
			</div>
		</Paper>
	);
};

export default FollowedListItem;
