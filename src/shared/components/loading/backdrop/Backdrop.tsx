import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '@shared/store';
import { selectBackdropLoadingState } from './backdrop-slice';

/**
 * BackdropLoading component
 * This component renders a material UI ```Backdrop``` component
 * with a CircularProgress spinner, controlled by Redux.
 */
function BackdropLoading() {
  const open = useAppSelector(selectBackdropLoadingState);

  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        // zIndex: (theme) => theme.zIndex.modal + 1
        zIndex: 99990
      }}
    >
      <CircularProgress size={96} color="secondary" />
    </Backdrop>
  );
}

export default BackdropLoading;
