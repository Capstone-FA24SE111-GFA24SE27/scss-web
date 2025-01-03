import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import {
	ExpandableText,
	ItemMenu,
	NavLinkAdapter,
	UserLabel,
	UserListItem,
	openDrawer,
} from '@/shared/components';
import {
	Box,
	Button,
	Chip,
	ListItem,
	Paper,
	Rating,
	Tooltip,
} from '@mui/material';
import { AccessTime, Add, ChevronRight, Visibility } from '@mui/icons-material';
import { CounselingDemand, Student } from '@shared/types';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { statusColor } from '@/shared/constants';
import { useAppDispatch } from '@shared/store';
import { CounselorView } from '@/shared/pages';

type StudentDemandsItemPropsType = {
	demand: CounselingDemand;
};

/**
 * The contact list item.
 */
function StudentDemandsItem({ demand }: StudentDemandsItemPropsType) {
	const navigate = useNavigate();
	const dispatch = useAppDispatch()
	return (
		<>
			<Paper
				key={demand.id}
				className='flex gap-16 p-16 shadow'
				sx={{ bgcolor: 'background.paper' }}
			>
				<div className='flex flex-col justify-center w-full gap-16'>
					<ListItem
						className='flex gap-8 px-0'
						secondaryAction={
							<ItemMenu
								menuItems={[
									{
										label: 'View details',
										onClick: () => {
											navigate(`${demand.id}`)
										},
										icon: <Visibility fontSize='small' />
									},
									{
										label: 'Update demand detail',
										icon: <Add fontSize='small' />,
										onClick: () => {
											navigate(`update/${demand.id}`);
										},
										disabled: demand.status === 'DONE',
									},
								]}
							/>
						}
					>
						{demand.startDateTime && (
							<>
								<div className='flex items-center gap-8'>
									<AccessTime />
									<Typography>
										{dayjs(demand.startDateTime).format(
											'YYYY-MM-DD'
										)}
									</Typography>
									<Typography>
										{dayjs(demand.startDateTime).format(
											'HH:mm'
										)}{' '}
										-{' '}
									</Typography>
								</div>
								<div className='flex items-center gap-8'>
									{demand.endDateTime ? (
										<>
											<Typography>
												{dayjs(
													demand.startDateTime
												).format('YYYY-MM-DD')}
											</Typography>
											<Typography>
												{dayjs(
													demand.startDateTime
												).format('HH:mm')}{' '}
												- {' '}
											</Typography>
										</>
									) : (
										<Typography>Ongoing</Typography>
									)}
								</div>
							</>
						)}
						<UserLabel
							profile={demand.supportStaff?.profile}
							label='Assigned by'
						/>

						<UserLabel
							profile={demand.counselor?.profile}
							label='Assigned to'
							onClick={() => dispatch(openDrawer({
								children: <CounselorView id={demand.counselor?.profile.id.toString()} />
							}))}
						/>

						<Chip
							label={demand.status}
							variant='filled'
							color={statusColor[demand.status]}
							size='small'
						/>
					</ListItem>

					<Tooltip
						title={`View ${demand.student.profile.fullName}'s profile`}
					>
						<ListItemButton
							component={NavLinkAdapter}
							to={`student/${demand.student.id}`}
							className='w-full rounded shadow bg-primary-light/5'
						>
							<UserListItem
								fullName={demand.student.profile.fullName}
								avatarLink={demand.student.profile.avatarLink}
								phoneNumber={demand.student.profile.phoneNumber}
								email={demand.student.email}
							/>
							<ChevronRight />
						</ListItemButton>
					</Tooltip>

					{/* <div className='flex gap-8'>
						<Typography className='w-96' color='textSecondary'>
							Summarize:
						</Typography>
						<ExpandableText
							text={demand.summarizeNote}
							limit={144}
						/>
					</div> */}

					<div className='flex gap-8'>
						<Typography className='w-96' color='textSecondary'>
							Contact Note:
						</Typography>
						<ExpandableText text={demand.contactNote} limit={144} />
					</div>
				</div>
			</Paper>
		</>
	);
}

export default StudentDemandsItem;
