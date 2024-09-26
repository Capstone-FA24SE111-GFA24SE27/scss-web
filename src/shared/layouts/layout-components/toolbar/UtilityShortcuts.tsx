import { NotificationPanelToggleButton } from '@/shared/components/notifications';
import { NotificationsNone, Search } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { memo } from 'react';
function UtilityShortcuts() {

    const items = [
        {
            icon: Search,
            name: 'Search',
        },
        // {
        //     icon: NotificationsNone,
        //     name: 'Notification',
        //     onClick: () => dispatch(openNotificationPanel())
        // },
    ]
    return (
        <div className='flex items-center gap-4'>
            {
                items.map(item =>
                    // < Tooltip title={item.name} key={item.name}>
                    <IconButton key={item.name}>
                        <item.icon />
                    </IconButton>
                    // </Tooltip>
                )
            }
            <NotificationPanelToggleButton />
        </div >
    );
}

export default memo(UtilityShortcuts)