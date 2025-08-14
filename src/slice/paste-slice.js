import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

function safeParsePastes() {
	try {
		const item = localStorage.getItem('pastes');
		return item ? JSON.parse(item) : [];
	} catch {
		localStorage.removeItem('pastes');
		return [];
	}
}

function savePastes(pastes) {
	localStorage.setItem('pastes', JSON.stringify(pastes));
}

const initialState = {
	pastes: safeParsePastes(),
};

const pasteSlice = createSlice({
	name: 'paste',
	initialState,
	reducers: {
		addPaste: (state, action) => {
			state.pastes.push(action.payload);
			savePastes(state.pastes);
			toast.success('Paste Added!');
		},
		removePaste: (state, action) => {
			state.pastes = state.pastes.filter(paste => paste._id !== action.payload);
			savePastes(state.pastes);
			toast.success('Paste removed!');
		},
		clearPastes: (state) => {
			state.pastes = [];
			localStorage.removeItem('pastes');
			toast.success('All pastes cleared!');
		},
		updatePaste: (state, action) => {
			const index = state.pastes.findIndex(paste => paste._id === action.payload._id);
			if (index !== -1) {    
				state.pastes[index] = action.payload;
				savePastes(state.pastes);
				toast.success('Paste updated!');
			}
		},
	},
});

export const { addPaste, removePaste, clearPastes, updatePaste, resetPastes } = pasteSlice.actions;
export default pasteSlice.reducer;
