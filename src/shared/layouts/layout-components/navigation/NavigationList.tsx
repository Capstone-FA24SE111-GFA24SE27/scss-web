import { roles } from '@/shared/constants';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { Fragment, memo, useState } from 'react';
import { navigationOptions } from './navigation-options';

function NavigationList() {
    const [open, setOpen] = useState(true);

    const handleClick = () => {
        setOpen(!open);
    };

    const items = navigationOptions[roles.STUDENT].list

    return (
        <div className='px-4'>
            <List
                sx={{ width: '100%', bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                    <ListSubheader component="div" id="nested-list-subheader">
                        Services
                    </ListSubheader>
                }
            >
                {items.map(item => (
                    <Fragment key={item.name}>
                        <ListItemButton onClick={item.nestedItems ? handleClick : undefined}>
                            <ListItemIcon>
                                {<item.icon />}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                            {item.nestedItems && (open ? <ExpandLess /> : <ExpandMore />)}
                        </ListItemButton>
                        {item.nestedItems && (
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {item.nestedItems.map(nestedItem => (
                                        <ListItemButton key={nestedItem.name} sx={{ pl: 4 }}>
                                            <ListItemIcon>
                                                {<nestedItem.icon />}
                                            </ListItemIcon>
                                            <ListItemText primary={nestedItem.name} />
                                        </ListItemButton>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </Fragment>
                ))}
            </List>
        </div>
    );
}

export default memo(NavigationList)