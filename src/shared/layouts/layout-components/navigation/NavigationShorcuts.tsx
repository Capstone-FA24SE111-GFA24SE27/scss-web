import { roles } from '@/shared/constants';
import { IconButton, Tooltip } from '@mui/material';
import { roleBasedNavigation } from './role-based-navigation';
import { memo } from 'react';
import { NavLinkAdapter } from '@/shared/components';
import { selectAccount, useAppSelector } from '@shared/store';
function NavigationShortcuts() {
	const account = useAppSelector(selectAccount)
    const shortcutsMenu = roleBasedNavigation[account.role].shortcuts;


    return (
        <div className='flex items-center gap-4'>
            {
                shortcutsMenu.map(item =>
                    <Tooltip title={item.name} key={item.name}>
                        <IconButton component={NavLinkAdapter} to={item.route}>
                            <item.icon />
                        </IconButton>
                    </Tooltip>
                )
            }
        </div >
    );
}

export default memo(NavigationShortcuts)