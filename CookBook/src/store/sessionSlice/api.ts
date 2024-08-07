import axiosInstance from '../utils/axiosInstance'

export const checkUser = async (login: string, password: string) => {
	try {
		const response = await axiosInstance.post('/api/login', {
			email: login,
			password: password,
		})
		localStorage.setItem('token', response.data.token)
		return response.data
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	} catch (error: any) {
		if (error.response) {
			// Сервер ответил с кодом состояния, отличным от 2xx
			console.error('Error response:', error.response.data)
			return error.response.data
		} else if (error.request) {
			// Запрос был сделан, но ответ не был получен
			console.error('Error request:', error.request)
			return { message: 'No response from server' }
		} else {
			// Произошло что-то еще при настройке запроса
			console.error('Error:', error.message)
			return { message: error.message }
		}
	}
}

export const registerUser = async (
	userName: string,
	login: string,
	password: string
) => {
	try {
		const response = await axiosInstance.post('/api/register', {
			userName: userName,
			email: login,
			password: password,
		})

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

export const likeRecipe = async (recipeId: string, userName: string) => {
	try {
		const response = await axiosInstance.post('/api/recipes/like', {
			recipeId: recipeId,
			userName: userName,
		})

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

export const unLikeRecipe = async (recipeId: string, userName: string) => {
	try {
		const response = await axiosInstance.post('/api/recipes/unlike', {
			recipeId: recipeId,
			userName: userName,
		})

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
