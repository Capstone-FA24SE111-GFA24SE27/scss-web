import { createSlice, PayloadAction, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';

type InitialStateProps = {
  open: boolean;
};

/**
 * The initial state of the backdrop slice.
 */
const initialState: InitialStateProps = {
  open: false,
};

/**
 * The Backdrop slice
 */
export const backdropSlice = createSlice({
  name: 'backdrop',
  initialState,
  reducers: {
    setBackdropLoading: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload; // Open if true, close if false
    },
  },
  selectors: {
    selectBackdropLoadingState: (backdrop) => backdrop.open,
  },
});

/**
 * Lazy load
 */
rootReducer.inject(backdropSlice);
const injectedSlice = backdropSlice.injectInto(rootReducer);

declare module '@shared/store' {
  export interface LazyLoadedSlices extends WithSlice<typeof backdropSlice> { }
}

export const { setBackdropLoading } = backdropSlice.actions;

export const { selectBackdropLoadingState } = injectedSlice.selectors;

export default backdropSlice.reducer;
