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
import { Student } from '@shared/types';
import { useParams } from 'react-router-dom';

type StudentListItemPropsType = {
	student: Student;
};

/**
 * The contact list item.
 */
function StudentListItem(props: StudentListItemPropsType) {
	const { student } = props;
	const { id } = useParams()

	return (
		<>
			<ListItemButton
				selected={student?.id == Number(id)}
				className="p-8 flex gap-24 items-center px-24 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`student/${student.profile.id}`}
			>
				<ListItemAvatar>
					<Avatar
						alt={student.profile.fullName}
						src={student.profile.avatarLink}
						className='size-80'
					/>
				</ListItemAvatar>
				<Box className='flex flex-col gap-8 justify-between'>
					<ListItemText
						classes={{ root: 'm-0', primary: 'font-semibold leading-5 truncate text-lg' }}
						primary={student.profile.fullName}
						secondary={student.studentCode}
					/>
					<div className="flex items-center gap-16">
						<div className="flex items-center w-120">
							<LocalPhoneOutlined fontSize='small' />
							<div className="ml-8 text-text-secondary leading-6">{student.profile.phoneNumber}</div>
						</div>
						<div className="flex items-center">
							<EmailOutlined fontSize='small' />
							<div className="ml-8 text-text-secondary leading-6">{student.email}</div>
						</div>
					</div>

				</Box>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default StudentListItem;
