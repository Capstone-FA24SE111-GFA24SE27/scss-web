import { NavLinkAdapter } from '@shared/components';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import { Close } from '@mui/icons-material';
/**
 * The contacts sidebar content.
 */
function CounselingSidebarContent() {
    return (
        <div className="flex flex-col flex-auto max-w-full w-fit">
            <IconButton
                className="absolute top-0 right-0 my-16 mx-32 z-10"
                component={NavLinkAdapter}
                to="."
                size="large"
            >
                <Close/>
            </IconButton>

            <Outlet />
        </div>
    );
}

export default CounselingSidebarContent;
