import { configureStore } from '@reduxjs/toolkit';
import pasteReducer from './slice/paste-slice'; // Uncomment and create this later

export const store = configureStore({
	reducer: {
		paste: pasteReducer, 
	},
});
