import { roles } from '@/shared/constants';
import { IconButton, Tooltip } from '@mui/material';
import { roleBasedNavigation } from './role-based-navigation';
import { memo } from 'react';
function NavigationShortcuts() {
    const items = roleBasedNavigation[roles.STUDENT].shortcuts

    return (
        <div className='flex items-center gap-4'>
            {
                items.map(item =>
                    <Tooltip title={item.name} key={item.name}>
                        <IconButton>
                            <item.icon />
                        </IconButton>
                    </Tooltip>
                )
            }
        </div >
    );
}

export default memo(NavigationShortcuts)