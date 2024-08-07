const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const app = express()
app.use(bodyParser.json())
app.use(cors())

const RECIPES_FILE = './recipes.json'
const USERS_FILE = './tmp/users.json'
const JWT_SECRET = 'your_jwt_secret_key'

// Функция для чтения данных пользователей из файла
const readUsersFromFile = () => {
	try {
		if (!fs.existsSync(USERS_FILE)) {
			fs.writeFileSync(USERS_FILE, JSON.stringify([]))
		}
		const usersData = fs.readFileSync(USERS_FILE, 'utf8')
		return JSON.parse(usersData)
	} catch (error) {
		console.error('Ошибка при чтении файла пользователей:', error)
		return []
	}
}

// Функция для записи данных пользователей в файл
const writeUsersToFile = users => {
	try {
		fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 3))
	} catch (error) {
		console.error('Ошибка при записи файла пользователей:', error)
	}
}

// Регистрация нового пользователя
app.post('/api/register', async (req, res) => {
	const { userName, email, password } = req.body
	const users = readUsersFromFile()

	const existingUser = users.find(user => user.email === email)

	if (existingUser) {
		return res.status(400).json({ message: 'Email уже зарегистрирован' })
	}

	const hashedPassword = await bcrypt.hash(password, 10)
	const newUser = { userName, email, password: hashedPassword }
	users.push(newUser)
	writeUsersToFile(users)

	return res.status(201).json({ message: 'Регистрация успешна' })
})

// Функция для чтения данных рецептов из файла
const readRecipeFromFile = () => {
	try {
		if (!fs.existsSync(RECIPES_FILE)) {
			fs.writeFileSync(RECIPES_FILE, JSON.stringify([]))
		}
		const recipeData = fs.readFileSync(RECIPES_FILE, 'utf8')
		return JSON.parse(recipeData)
	} catch (error) {
		console.error('Ошибка при чтении файла рецептов:', error)
		return []
	}
}

// Функция для записи нового рецепта в файл
const writeRecipeToFile = recipes => {
	try {
		fs.writeFileSync(RECIPES_FILE, JSON.stringify(recipes, null, 3))
	} catch (error) {
		console.error('Ошибка при записи файла рецептов:', error)
	}
}

// Регистрация нового рецепта
app.post('/api/newRecipes', async (req, res) => {
	const recipe = req.body
	recipe.id = uuidv4() // Добавление уникального id
	const recipes = readRecipeFromFile()

	recipes.push(recipe)
	writeRecipeToFile(recipes)
	return res.status(201).json({ message: 'создание рецепта, успешно' })
})

// Функция для удаления рецепта по ID
const deleteRecipeById = id => {
	try {
		const recipes = readRecipeFromFile()
		const updatedRecipes = recipes.filter(recipe => recipe.id !== id)
		writeRecipeToFile(updatedRecipes)
		return updatedRecipes
	} catch (error) {
		console.error('Ошибка при удалении рецепта:', error)
		return null
	}
}

// Удаление рецепта по ID
app.delete('/api/recipes/:id', (req, res) => {
	const { id } = req.params
	const updatedRecipes = deleteRecipeById(id)
	if (updatedRecipes) {
		res.status(200).json({ message: 'Рецепт успешно удален' })
	} else {
		res.status(500).json({ message: 'Ошибка при удалении рецепта' })
	}
})

// Логин пользователя
app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	const users = readUsersFromFile()

	const user = users.find(user => user.email === email)
	if (!user) {
		return res.status(400).json({ message: 'Неверный email или пароль' })
	}

	const isPasswordValid = await bcrypt.compare(password, user.password)
	if (!isPasswordValid) {
		return res.status(400).json({ message: 'Неверный email или пароль' })
	}

	const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' })

	res.json({ token })
})

// Миддлвар для проверки токена
const authenticate = (req, res, next) => {
	const token = req.headers['authorization']
	if (!token) {
		return res.status(401).json({ message: 'Токен не предоставлен' })
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET)
		req.user = decoded
		next()
	} catch (error) {
		res.status(401).json({ message: 'Неверный токен' })
	}
}

// Получение списка пользователей
app.get('/api/recipes', (req, res) => {
	const recipes = readRecipeFromFile()
	res.json(recipes)
})

// Получение списка рецептов
app.get('/api/recipes', (req, res) => {
	const recipes = readRecipeFromFile()
	res.status(200).json(recipes)
})

// Получение данных конкретного пользователя
app.get('/api/users/:email', authenticate, (req, res) => {
	const { email } = req.params
	const users = readUsersFromFile()
	const user = users.find(user => user.email === email)

	if (!user) {
		return res.status(404).json({ message: 'Пользователь не найден' })
	}

	res.json(user)
})

// Функция для добавления пользователя в массив likedUsers рецепта
const addLikedUser = (recipeId, userName) => {
	const recipes = readRecipeFromFile()
	const recipe = recipes.find(recipe => recipe.id === recipeId)
	if (!recipe) {
		return null
	}
	if (!recipe.detailed_info.likedUsers.includes(userName)) {
		recipe.detailed_info.likedUsers.push(userName)
		writeRecipeToFile(recipes)
	}
	return recipe
}

// Добавление пользователя в likedUsers рецепта
app.post('/api/recipes/like', (req, res) => {
	const { recipeId, userName } = req.body
	const updatedRecipe = addLikedUser(recipeId, userName)
	if (updatedRecipe) {
		res.status(200).json({
			message: 'Пользователь добавлен в likedUsers',
			recipe: updatedRecipe,
		})
	} else {
		res.status(404).json({ message: 'Рецепт не найден' })
	}
})

const removeLikedUser = (recipeId, userName) => {
	const recipes = readRecipeFromFile()
	const recipe = recipes.find(recipe => recipe.id === recipeId)
	if (!recipe) {
		return null
	}
	const userIndex = recipe.detailed_info.likedUsers.indexOf(userName)
	if (userIndex !== -1) {
		recipe.detailed_info.likedUsers.splice(userIndex, 1)
		writeRecipeToFile(recipes)
	}
	return recipe
}

// Добавление нового API маршрута для удаления пользователя из likedUsers рецепта
app.post('/api/recipes/unlike', (req, res) => {
	const { recipeId, userName } = req.body
	const updatedRecipe = removeLikedUser(recipeId, userName)
	if (updatedRecipe) {
		res.status(200).json({
			message: 'Пользователь удален из likedUsers',
			recipe: updatedRecipe,
		})
	} else {
		res.status(404).json({ message: 'Рецепт не найден' })
	}
})

app.listen(8080, () => {
	console.log('Server is running on port 8080')
})
