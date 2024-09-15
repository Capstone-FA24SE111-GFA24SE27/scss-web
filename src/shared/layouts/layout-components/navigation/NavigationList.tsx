import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { roles } from '@/shared/constants';
import { navigationOptions } from './navigation-options';

export default function Navigation() {
    const [open, setOpen] = React.useState(true);

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
                    <React.Fragment key={item.name}>
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
                    </React.Fragment>
                ))}
            </List>
        </div>
    );
}