import { NavLinkAdapter } from '@shared/components';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import { Close } from '@mui/icons-material';
/**
 * The contacts sidebar content.
 */
function QnaSidebarContent() {
  return (
    <div className="flex-1 h-full">
      <IconButton
        className="absolute right-0 z-10 top-16"
        component={NavLinkAdapter}
        to="."
        size="large"
      >
        <Close />
      </IconButton>

      <Outlet />
    </div>
  );
}

export default QnaSidebarContent;
