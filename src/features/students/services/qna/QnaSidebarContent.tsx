import { NavLinkAdapter } from '@shared/components';
import IconButton from '@mui/material/IconButton';
import { Outlet } from 'react-router-dom';
import { Close } from '@mui/icons-material';
/**
 * The contacts sidebar content.
 */
function QnaSidebarContent() {
  return (
    <div className="h-full">
      <IconButton
        className="absolute top-16 right-0 z-10"
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
