import Typography from '@mui/material/Typography';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { ExpandableText, ItemMenu, UserLabel, UserListItem, closeDialog, openDialog } from '@/shared/components';
import { priorityColor, statusColor } from '@/shared/constants';
import { AccessTime, Add, CalendarMonth, Check, Visibility } from '@mui/icons-material';
import { Chip, ListItem, Paper, Tooltip, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Box } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import { useAppDispatch } from '@shared/store';
import { CounselingDemand } from '@shared/types';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { openStudentView } from '../../counselors-layout-slice';
import { useSolveCounselingDemandMutation } from './student-demands-api';
import { useState } from 'react'

type StudentDemandsItemPropsType = {
	demand: CounselingDemand;
};

/**
 * The contact list item.
 */
function StudentDemandsItem({ demand }: StudentDemandsItemPropsType) {
	const dispatch = useAppDispatch()
	const navigate = useNavigate()
	return (
		<>
			<Paper
				key={demand.id}
				className="p-16 flex gap-16 shadow"
				sx={{ bgcolor: 'background.paper' }}
			>
				<div className="flex flex-col gap-16 w-full justify-center">
					<ListItem
						className="flex gap-16 p-0"
						secondaryAction={
							<ItemMenu
								menuItems={[
									{
										label: 'View details',
										onClick: () => {
											navigate(`demand/${demand.id}`)
										},
										icon: <Visibility fontSize='small' />
									},
									{
										label: 'Create an appointment',
										icon: <Add fontSize='small' />,
										onClick: () => { navigate(demand.id.toString()) },
										disabled: demand.status !== 'PROCESSING'
									},
									{
										label: 'Solve',
										icon: <Check fontSize='small' />,
										onClick: () => {
											dispatch(openDialog({
												children: <SolveCounselingDemandDialog demand={demand} />
											}))
										},
										disabled: demand.status !== 'PROCESSING'
									},
								]}
							/>
						}
					>
						<div className='flex gap-8'>
							<div className="flex gap-8 items-center">
								<CalendarMonth fontSize='small' />
								<Typography>{dayjs(demand.startDateTime).format('YYYY-MM-DD')}</Typography>
								<Typography>
									{dayjs(demand.startDateTime).format('HH:mm')}
								</Typography>
							</div>
							<div className="flex gap-8 items-center">
								- {
									demand.endDateTime
										? <>
											<CalendarMonth fontSize='small' />
											<Typography>{dayjs(demand.endDateTime).format('YYYY-MM-DD')}</Typography>
											<Typography>
												{dayjs(demand.endDateTime).format('HH:mm')}
											</Typography>
										</>
										: <Typography>
											Ongoing
										</Typography>
								}
							</div>
						</div>


						<Chip
							label={demand.status}
							variant="filled"
							color={statusColor[demand.status]}
							size="small"
						/>
					</ListItem>

					<Tooltip title={`View ${demand.student.profile.fullName}'s profile`}>
						<ListItemButton
							className="bg-primary-light/5 w-full rounded shadow"
							onClick={() => dispatch(openStudentView(demand.student.profile.id.toString()))}
						>
							<UserListItem
								fullName={demand.student.profile.fullName}
								avatarLink={demand.student.profile.avatarLink}
								phoneNumber={demand.student.profile.phoneNumber}
								email={demand.student.email}
							/>
							{/* <ChevronRight /> */}
						</ListItemButton>
					</Tooltip>
					<Box className='flex flex-col gap-8'>
						<UserLabel
							profile={demand.supportStaff?.profile}
							label='Assigned by'
						/>
						<div className='flex items-center gap-8'>
							<Typography className='text-sm text-text-secondary w-64'>Priority:</Typography>
							<Typography className='text-sm font-bold' color={priorityColor[demand.priorityLevel]}>{demand.priorityLevel}</Typography>
						</div>
					</Box>
				</div>
			</Paper >
		</>
	);
}

export default StudentDemandsItem;


const SolveCounselingDemandDialog = ({ demand }: { demand: CounselingDemand }) => {
	const [solve, { isLoading: isSolving }] = useSolveCounselingDemandMutation()
	const [summarize, setSummarize] = useState(``)
	const dispatch = useAppDispatch();
	const handleCancelAppointment = () => {
		solve({
			counselingDemandId: demand.id.toString(),
			summarizeNote: summarize
		}).unwrap()
			.then(() => {
				dispatch(closeDialog())
			})

	}
	return (
		<div className='w-[40rem]'>
			<DialogTitle id="alert-dialog-title">Solve the selected demand?</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					<div>
						Give the summarize
					</div>
					<div>
						<TextField
							autoFocus
							margin="dense"
							name={'Summazie'}
							label={'Summazie'}
							fullWidth
							multiline
							rows={6}
							value={summarize}
							className='mt-16'
							slotProps={{
								inputLabel: {
									shrink: true,
								}
							}}
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setSummarize(event.target.value);
							}} />
					</div>
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => dispatch(closeDialog())} color="primary">
					Cancel
				</Button>
				<Button
					onClick={handleCancelAppointment}
					color="secondary" variant='contained'
					disabled={!summarize || isSolving}
				>
					Confirm
				</Button>
			</DialogActions>
		</div>
	);
}