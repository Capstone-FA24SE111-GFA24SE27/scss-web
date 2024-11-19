import Avatar from '@mui/material/Avatar';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { Box, Button, Chip, Rating } from '@mui/material';
import { EmailOutlined, LocalPhoneOutlined, Mail, Phone } from '@mui/icons-material';
import { Counselor } from '@shared/types';
import { useParams } from 'react-router-dom';

type CounselorListItemPropsType = {
	counselor: Counselor;
	onClick: (counselor: Counselor)=>void
};

/**
 * The contact list item.
 */
function CounselorListItem(props: CounselorListItemPropsType) {
	const { counselor, onClick } = props;

	return (
		<>
			<ListItemButton
				className="box-border w-full gap-24 px-24 py-44 "
				sx={{ bgcolor: 'background.paper' }}
				component={Button}
				onClick={()=>onClick(counselor)}
			>
				<ListItemAvatar>
					<Avatar
						alt={counselor.profile.fullName}
						src={counselor.profile.avatarLink}
						className='size-80'
					/>
				</ListItemAvatar>
				<Box className='flex flex-col justify-between gap-8'>
					<ListItemText
						classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
						primary={counselor.profile.fullName}
						secondary={counselor.expertise?.name || counselor.specialization?.name}
					/>

					<div className="flex items-center gap-16">
						<div className="flex items-center w-120">
							<LocalPhoneOutlined fontSize='small' />
							<div className="ml-8 leading-6 text-text-secondary">{counselor.profile.phoneNumber}</div>
						</div>
						<div className="flex items-center">
							<EmailOutlined fontSize='small' />
							<div className="ml-8 leading-6 text-text-secondary">{counselor.email}</div>
						</div>
					</div>

				</Box>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default CounselorListItem;
