import { createSlice, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
/**
 * The initial state of the navbar slice.
 */
const initialState = {
    open: true,
    mobileOpen: false,
    foldedOpen: false
};
/**
 * The navbar slice.
 */
export const navbarSlice = createSlice({
    name: 'navigation',
    initialState,
    reducers: {
        navbarToggleFolded: (state) => {
            state.foldedOpen = !state.foldedOpen;
        },
        navbarOpenFolded: (state) => {
            state.foldedOpen = true;
        },
    },
    selectors: {
        selectNavbar: (navbar) => navbar
    }
});
/**
 * Lazy loading
 */
rootReducer.inject(navbarSlice);
const injectedSlice = navbarSlice.injectInto(rootReducer);
export const {
    navbarToggleFolded,
    navbarOpenFolded,
} = navbarSlice.actions;
export const { selectNavbar } = injectedSlice.selectors;
export default navbarSlice.reducer;

declare module '@shared/store' {
    export interface LazyLoadedSlices extends WithSlice<typeof navbarSlice> { }
}