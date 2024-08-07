import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SessionState {
	sessionInfo: {
		token: string | null
		userName: string
	}
}

export const initialState: SessionState = {
	sessionInfo: {
		token: null,
		userName: '',
	},
}

const sessionSlice = createSlice({
	name: 'session',
	initialState,
	reducers: {
		signIn: (
			state,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			action: PayloadAction<{ token: string; userName: any }>
		) => {
			state.sessionInfo.token = action.payload.token
			state.sessionInfo.userName = action.payload.userName
			localStorage.setItem('token', action.payload.token)
			localStorage.setItem('userName', action.payload.userName)
		},
		signOut: state => {
			state.sessionInfo.token = null
			state.sessionInfo.userName = 'гость'
			localStorage.removeItem('token')
			localStorage.removeItem('userName')
		},
	},
})

export const actionsSession = sessionSlice.actions

export default sessionSlice.reducer
