import {
	configureStore,
	Middleware,
	ThunkAction,
	Action,
} from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';
import apiService from './api-service';
import { dynamicMiddleware } from './middleware';

const middlewares: Middleware[] = [apiService.middleware, dynamicMiddleware];

export const store = configureStore({
	reducer: rootReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['dialog/openDialog', 'chatSessionSlice/setChatListeners', 'chatSessionSlice/setPassiveChatCallback', 'createAccountAdminSlice'],
				ignoredPaths: ['dialog.children', 'chatSessionSlice.listeners', 'chatSessionSlice.passiveCallBack', 'createAccountAdminSlice']
			},
		}).concat(middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ThunkReturnType = void> = ThunkAction<
	ThunkReturnType,
	RootState,
	unknown,
	Action
>;
