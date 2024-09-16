import IconButton from '@mui/material/IconButton';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { navbarToggle, navbarToggleMobile } from './navbar-slice';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactElement } from 'react';

/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: { className?: string, children?: ReactElement }) {
    const {
        className = 'h-40 w-40 p-0',
        children = (
            <MenuIcon fontSize='large' />
        )
    } = props;
    const dispatch = useAppDispatch();
    return (
        <IconButton
            className={`className`}
            color="inherit"
            onClick={() => { dispatch(navbarToggle()) }}
        >
            {children}
        </IconButton>
    );
}

export default NavbarToggleButton;
