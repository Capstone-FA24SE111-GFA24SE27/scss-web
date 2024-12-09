import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { selectAccount, useAppSelector } from '@shared/store';
import { Fragment, memo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { roleBasedNavigation } from './role-based-navigation';

function NavigationList() {
    const [open, setOpen] = useState(true);
    const [selectedItem, setSelectedItem] = useState('home')

    const navigate = useNavigate();

    const account = useAppSelector(selectAccount)

    const location = useLocation();


    const { pathname } = location;

    if (!account) {
        return
    }

    const navigationList = roleBasedNavigation[account.role].list



    const handleOpen = () => {
        setOpen(!open);
    };


    const handleNavigation = (path: string) => {
        navigate(path)
    }

    return (
        <div className='px-8'>
            <List
                sx={{ width: '100%' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {navigationList.map(sublist => (
                    <div key={sublist.name} >
                        <div className='my-8 flex flex-col'>
                            <Typography variant="overline" className='font-bold'>{sublist.name}</Typography>
                            <Typography variant="caption" className='text-black/80'>{sublist.description}</Typography>
                        </div>
                        {sublist.items.map(item => (
                            <Fragment key={item.name}>
                                <ListItemButton
                                    className={`rounded-md mt-4 `}
                                    onClick={item.children
                                        ? handleOpen :
                                        () => handleNavigation(`${sublist.route}/${item.route}`)}
                                    selected={!item.children && pathname.includes(`${sublist.route}/${item.route}`)}
                                >
                                    <ListItemIcon>
                                        {<item.icon color={pathname.includes(`${sublist.route}/${item.route}`) ? 'primary' : 'inherit'} />}
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
                                </ListItemButton>
                                {item.children && (
                                    <Collapse in={open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {item.children.map(nestedItem => (
                                                <ListItemButton
                                                    key={nestedItem.name}
                                                    onClick={() => handleNavigation(`${sublist.route}/${item.route}/${nestedItem.route}`)}
                                                    sx={{ ml: 2 }}
                                                    className='rounded-md'
                                                    selected={pathname.includes(`${sublist.route}/${item.route}/${nestedItem.route}`)} >
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
                    </div>
                ))}
            </List>
        </div>
    );
}

export default memo(NavigationList)