import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
// import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { NavLinkAdapter } from '@/shared/components';
import { Box, Chip, Rating } from '@mui/material';
import { EmailOutlined, LocalPhoneOutlined, Mail, Phone } from '@mui/icons-material';
import { Counselor } from '@shared/types';
import { useParams } from 'react-router-dom';

type CounselorListItemPropsType = {
	counselor: Counselor;
};

/**
 * The contact list item.
 */
function CounselorListItem(props: CounselorListItemPropsType) {
	const { counselor } = props;
	const { id } = useParams()

	return (
		<>
			<ListItemButton
				selected={counselor?.id == Number(id)}
				className="p-8 flex gap-24 items-start px-24 py-16 justify-between bg-background-paper"
				component={NavLinkAdapter}
				to={`counselor/${counselor.profile.id}`}
			>
				<div className='flex gap-24 items-start'>
					<ListItemAvatar>
						<Avatar
							alt={counselor.profile.fullName}
							src={counselor.profile.avatarLink}
							className='size-80'
						/>
					</ListItemAvatar>
					<Box className='flex flex-col gap-8 justify-between'>
						<ListItemText
							classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
							primary={counselor.profile.fullName}
							secondary={counselor.expertise?.name || counselor.major?.name}
						/>
						<div className="flex items-center gap-16">
							<div className="flex items-center w-120">
								<LocalPhoneOutlined fontSize='small' />
								<div className="ml-8 text-text-secondary leading-6">{counselor.profile.phoneNumber}</div>
							</div>
							<div className="flex items-center">
								<EmailOutlined fontSize='small' />
								<div className="ml-8 text-text-secondary leading-6">{counselor.email}</div>
							</div>
						</div>
						<div className="flex flex-wrap mt-8 gap-8">
							{
								counselor.specializedSkills?.split(`\n`).map(item => (
									<Chip
										key={item}
										label={item}
										size="small"
									/>
								))
							}
						</div>
					</Box>

				</div>

				{/* <div className='flex gap-8 text-sm text-text-secondary'>
					<Rating
						name="simple-controlled"
						size='small'
						value={counselor.rating}
						readOnly
						precision={0.5}
					/>
					({counselor?.rating}/5)
				</div> */}
			</ListItemButton >
			<Divider />
		</>
	);
}

export default CounselorListItem;
