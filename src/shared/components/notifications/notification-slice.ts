import { createSlice, WithSlice } from "@reduxjs/toolkit";
import { rootReducer } from "@shared/store";


type initialStateType = boolean

const initialState : initialStateType = false;

export const notificationPanelSlice = createSlice({
    name: 'notificationPanelSlice',
    initialState,
    reducers: {
        toggleNotificationPanel: (state) => !state,
        openNotificationPanel: () => true,
        closeNotificationPanel: () => false,

    },
    selectors: {
        selectNotificationPanelState: (state) => state
    }
})


rootReducer.inject(notificationPanelSlice)
const injectedSlice = notificationPanelSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices extends WithSlice<typeof notificationPanelSlice> {}

}

export const { toggleNotificationPanel, openNotificationPanel, closeNotificationPanel } =
	notificationPanelSlice.actions;

export const { selectNotificationPanelState } = injectedSlice.selectors;

export default notificationPanelSlice.reducer;