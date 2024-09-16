import * as React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { IconButton, Tooltip } from '@mui/material';
import { roles } from '@/shared/constants';
import { NotificationsNone, Search } from '@mui/icons-material';
export default function UtilityShortcuts() {
    const items =  [
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
                        <IconButton>
                            <item.icon />
                        </IconButton>
                    // </Tooltip>
                )
            }
        </div >
    );
}