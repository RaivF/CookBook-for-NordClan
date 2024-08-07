import { RecipeEntity } from '../types'
import axiosInstance from '../utils/axiosInstance'

export const fetchUsers = async (): Promise<RecipeEntity[]> => {
	try {
		const response = await axiosInstance.get('/api/recipes')

		return response.data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw { message: error.message || 'ошибка связи с севером' }
	}
}

export const registerRecipe = async (recipe: RecipeEntity) => {
	try {
		const response = await axiosInstance.post('/api/newRecipes', recipe)

		return response.status
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error.response) {
			// Сервер ответил с кодом состояния, отличным от 2xx
			console.error('Error response:', error.response.data)
			return error.response.status
		} else if (error.request) {
			// Запрос был сделан, но ответ не был получен
			console.error('Error request:', error.request)
			return error.response.status
		} else {
			// Произошло что-то еще при настройке запроса
			console.error('Error:', error.message)
			return error.response.status
		}
	}
}

export const DeleteRecipe = async (id: string) => {
	try {
		const response = await axiosInstance.delete(`/api/recipes/${id}`)
		return response.data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		throw {
			message: error.response?.data?.message || 'Ошибка связи с сервером',
		}
	}
}
