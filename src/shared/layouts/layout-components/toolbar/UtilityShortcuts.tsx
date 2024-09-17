import { NotificationsNone, Search } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { memo } from 'react';
function UtilityShortcuts() {
    const items = [
        {
            icon: Search,
            name: 'Calendar',
        },
        {
            icon: NotificationsNone,
            name: 'Mail',
        },
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
        </div >
    );
}

export default memo(UtilityShortcuts)