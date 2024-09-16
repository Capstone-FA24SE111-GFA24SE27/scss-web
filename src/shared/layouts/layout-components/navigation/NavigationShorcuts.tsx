import * as React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { IconButton, Tooltip } from '@mui/material';
import { navigationOptions } from './navigation-options';
import { roles } from '@/shared/constants';
export default function NavigationShortcuts() {
    const items = navigationOptions[roles.STUDENT].shortcuts

    return (
        <div className='flex items-center gap-4'>
            {
                items.map(item =>
                    < Tooltip title={item.name} key={item.name}>
                        <IconButton>
                            <item.icon />
                        </IconButton>
                    </Tooltip>
                )
            }
        </div >
    );
}