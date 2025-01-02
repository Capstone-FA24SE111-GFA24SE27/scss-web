import Drawer from '@mui/material/Drawer';
import { useAppDispatch, useAppSelector } from '@shared/store';
import { closeDrawer, selectDrawerProps } from './drawer-slice';

/**
 * ReusableDrawer component
 * This component renders a material UI `Drawer` component
 * with properties pulled from the redux store
 */
function ReusableDrawer() {
    const dispatch = useAppDispatch();
    const options = useAppSelector(selectDrawerProps);

    return (
        <Drawer
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer
            }}
            onClose={() => dispatch(closeDrawer())}
            anchor={options.anchor || 'right'}
            open={options.open}
            classes={options.classes || {}}
            {...options}
        >
            {options.children}
        </Drawer>
    );
}

export default ReusableDrawer;
