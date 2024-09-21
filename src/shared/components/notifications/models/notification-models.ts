import _ from 'lodash';
import { ReactNode } from 'react';
import StarBorderIcon from '@mui/icons-material/StarBorder';

/**
 * The type of the NotificationModel.
 */
export type NotificationModelType = {
	id?: string;
	icon?: ReactNode;
	title?: string;
	description?: string;
	time?: string;
	read?: boolean;
	variant?:
		| 'success'
		| 'info'
		| 'error'
		| 'warning'
		| 'alert'
		| 'primary'
		| 'secondary';
	link?: string;
	image?: string;
	children?: ReactNode;
};

/**
 * The NotificationModel class.
 * Implements NotificationModelProps interface.
 */
function NotificationModel(data: NotificationModelType): NotificationModelType {
	data = data || {};

	return _.defaults(data, {
		id: Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1),
		icon: StarBorderIcon,
		title: '',
		description: '',
		time: new Date().toISOString(),
		read: false,
		variant: 'default',
	}) as NotificationModelType;
}

export default NotificationModel;
