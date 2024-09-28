import { createSlice, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';
import { NotificationType } from '@/shared/types';


type initialStateType = {
	open: boolean;
	notifications: NotificationType[];
};

const initialState: initialStateType = {
	open: false,
	notifications: [],
};

export const notificationPanelSlice = createSlice({
	name: 'notificationPanelSlice',
	initialState,
	reducers: {
		toggleNotificationPanel: (state) => {
            const prev = state.open
			state.open = !prev
		},
		openNotificationPanel: (state) => {
			state.open = true;
		},
		closeNotificationPanel: (state) => {
			state.open = false;
		},
        setNotifications: (state, action) => {
            state.notifications = action.payload
        },
        addNotification: (state, action) => {
            const prev = state.notifications
            state.notifications = [action.payload, ...prev]
        }
	},
	selectors: {
		selectNotificationPanelState: (state) => state.open,
        selectNotifications: (state) => state.notifications
	},
});

rootReducer.inject(notificationPanelSlice);
const injectedSlice = notificationPanelSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof notificationPanelSlice> {}
}

export const {
	toggleNotificationPanel,
	openNotificationPanel,
	closeNotificationPanel,
    setNotifications,
    addNotification,

} = notificationPanelSlice.actions;

export const { selectNotificationPanelState, selectNotifications } = injectedSlice.selectors;

export default notificationPanelSlice.reducer;
