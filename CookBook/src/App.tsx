import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './components/Auth/Register'
import Login from './components/Auth/Login'

import { useAppDispatch } from './store/store'
import { actionsSession } from './store/sessionSlice'

import { SearchList } from './pages/Finding/SearchList'
import RecipeList from './pages/RecipeList'
import { RecipeDetails } from './pages/RecipeDetails'

import { DeleteRecipe, registerRecipe } from './store/cardsSlice/api'

import RecipeForm from './pages/RecipeForm/RecipeForm'
import EditRecipeForm from './pages/EditRecipeForm/EditRecipeForm'
import { actionsCard } from './store/cardsSlice'
import { RecipeEntity } from './store/types'

const App: React.FC = () => {
	const dispatch = useAppDispatch()
	useEffect(() => {
		const userSessionToken = localStorage.getItem('token')
		const userName = localStorage.getItem('userName')
		if (userSessionToken) {
			dispatch(
				actionsSession.signIn({ token: userSessionToken, userName: userName })
			)
		}
	}, [])

	const handleNewRecipe = async (e: RecipeEntity) => {
		await registerRecipe(e)
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleEditRecipe = async (e: any) => {
		dispatch(actionsCard.deleteCard(e.id))
		await DeleteRecipe(e.id)
		await registerRecipe(e)
	}

	return (
		<Router>
			<Routes>
				<Route path='/register' element={<Register />} />
				<Route path='/' element={<RecipeList />} />
				<Route
					path='/recipeForm'
					element={<RecipeForm onSubmit={handleNewRecipe} />}
				/>
				<Route path='/login' element={<Login />} />
				<Route path='/recipe/:id' element={<RecipeDetails />} />
				<Route path='/search' element={<SearchList />} />
				<Route
					path='/edit/:id'
					element={<EditRecipeForm onSubmit={handleEditRecipe} />}
				/>
			</Routes>
		</Router>
	)
}

export default App
