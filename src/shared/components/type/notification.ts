import { ReactNode } from "react";

/**
 * The type of the NotificationModel.
 */
export type NotificationType = {
	notificationId?: number;
	title?: string;
	message?: string;
    receiverId: number;
	// time?: string;
	readStatus?: boolean;
	// variant?:
	// 	| 'success'
	// 	| 'info'
	// 	| 'error'
	// 	| 'warning'
	// 	| 'alert'
	// 	| 'primary'
	// 	| 'secondary';
	// link?: string;
};