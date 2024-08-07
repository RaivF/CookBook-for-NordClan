import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from './api'
import { actionsCard } from '.'

export const getData: AsyncThunk<void, void, object> = createAsyncThunk<
	void,
	void
>('getDataForRecipes', async (_, { dispatch }) => {
	dispatch(actionsCard.setIsLoading(true))
	try {
		const data = await api.fetchUsers()

		dispatch(actionsCard.setData(data))

		// если вы нашли этот костыль, то знайте, я потратил пол часа пытаясь понять что в этом случае от меня требует ts и всё равно не понял, прощу пощады и в других случаях тоже самое :(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		dispatch(
			actionsCard.setError({
				code: error.response?.status,
				message: error.message,
			})
		)
	} finally {
		dispatch(actionsCard.setIsLoading(false))
	}
})
