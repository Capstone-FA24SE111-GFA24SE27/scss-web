import _ from 'lodash';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { NotificationType } from '../../type/notification';



/**
 * The NotificationModel class.
 * Implements NotificationModelProps interface.
 */
function NotificationModel(data: Partial<NotificationType>): NotificationType {

	return _.defaults(data, {
		notificationId: Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1),
		title: '',
		message: '',
		// time: new Date().toISOString(),
		readStatus: false,
		// variant: 'default',
	}) as NotificationType;
}

export default NotificationModel;
