import { ForwardedRef, forwardRef } from 'react';
import { SnackbarContent } from 'notistack';
import NotificationCard from './NotificationCard';
import { NotificationType } from '@/shared/types';

type NotificationTemplateProps = {
	item: NotificationType;
	onClose: () => void;
};

/**
 * The notification template.
 */
const NotificationTemplate = forwardRef((props: NotificationTemplateProps, ref: ForwardedRef<HTMLDivElement>) => {
	const { item } = props;

	return (
		<SnackbarContent
			ref={ref}
			className="relative w-full py-4 mx-auto pointer-events-auto max-w-320"
		>
			<NotificationCard
				item={item}
				onClose={props.onClose}
			/>
		</SnackbarContent>
	);
});

export default NotificationTemplate;
