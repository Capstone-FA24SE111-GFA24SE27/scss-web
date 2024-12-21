import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

/**
 * Initial state for the drawer slice
 */
type InitialStateProps = {
  open: boolean;
  anchor: 'left' | 'right' | 'top' | 'bottom';
  children: React.ReactNode;
  classes?: Record<string, any>;
};

const initialState: InitialStateProps = {
  open: false,
  anchor: 'right',
  children: null,
  classes: {},
};

/**
 * The Drawer slice
 */
export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    openDrawer: (
      state,
      action: PayloadAction<{
        children: InitialStateProps['children'];
        anchor?: InitialStateProps['anchor'];
        classes?: InitialStateProps['classes'];
      }>
    ) => {
      state.open = true;
      state.children = action.payload.children;
      state.anchor = action.payload.anchor || 'right';
      state.classes = action.payload.classes || {};
    },
    closeDrawer: () => initialState,
  },
  selectors: {
    selectDrawerState: (drawer) => drawer.open,
    selectDrawerProps: (drawer) => drawer,
  },
});

/**
 * Lazy load
 */
rootReducer.inject(drawerSlice);
const injectedSlice = drawerSlice.injectInto(rootReducer);

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof drawerSlice> { }
}

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export const { selectDrawerState, selectDrawerProps } = injectedSlice.selectors;
export type drawerSliceType = typeof drawerSlice;

export default drawerSlice.reducer;
