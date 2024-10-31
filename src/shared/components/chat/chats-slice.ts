import { Message } from '@/shared/types';
import { createSlice, WithSlice } from '@reduxjs/toolkit';
import { rootReducer } from '@shared/store';


type initialStateType = {
	openedChatId: number | null;
	currentChatMessages: Message[]
};

const initialState: initialStateType = {
	openedChatId: null,
	currentChatMessages: [],
};

export const chatSessionSlice = createSlice({
	name: 'chatSessionSlice',
	initialState,
	reducers: {
		setChatSession: (state, action) => {
			const id = action.payload.id;
			const messages = action.payload.messages
			state.openedChatId = id
			state.currentChatMessages = messages
		},
		setChatSessionId: (state, action) => {
			const id = action.payload
			state.openedChatId = id
		},
		closeChatSession: (state) => {
			state.openedChatId = null
		},
		addChatMessages: (state, action) => {
			state.currentChatMessages.push(action.payload)
		}
	},
	selectors: {
		selectOpenedChatId: (state) => state.openedChatId,
		selectCurrentChatMessages: (state) => state.currentChatMessages
	},
});

rootReducer.inject(chatSessionSlice);
const injectedSlice = chatSessionSlice.injectInto(rootReducer);
declare module '@shared/store' {
	export interface LazyLoadedSlices
		extends WithSlice<typeof chatSessionSlice> {}
}

export const {
	setChatSession,
	setChatSessionId,
	addChatMessages,
	closeChatSession
} = chatSessionSlice.actions;

export const { selectOpenedChatId, selectCurrentChatMessages } = injectedSlice.selectors;

export default chatSessionSlice.reducer;
