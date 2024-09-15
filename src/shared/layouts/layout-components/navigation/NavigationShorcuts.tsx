import * as React from 'react';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { IconButton, Tooltip } from '@mui/material';
export default function NavigationShortcuts() {

    return (
        <div className='flex items-center gap-4'>
            <Tooltip title="Booking">
                <IconButton>
                    <CalendarMonthIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Booking">
                <IconButton>
                    <CalendarMonthIcon />
                </IconButton>
            </Tooltip>
        </div>
    );
}