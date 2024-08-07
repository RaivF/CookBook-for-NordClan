import React, { useEffect, useState } from 'react'
import styles from './EditRecipeForm.module.css'
import { Header } from '../../components/Layout/Header'

import { useFindRecipe } from '../../hooks/useCurrentUser'
import { useParams } from 'react-router-dom'
import { errorOBJ } from '../RecipeDetails'
import { RecipeEntity } from '../../store/types'

interface RecipeFormProps {
	onSubmit: (recipe: RecipeEntity) => void
}

const EditRecipeForm: React.FC<RecipeFormProps> = ({ onSubmit }) => {
	const cloneRecipe = (recipe: RecipeEntity) => {
		return JSON.parse(JSON.stringify(recipe))
	}

	const params = useParams()
	const currentRecipe = useFindRecipe(params.id!) || errorOBJ

	const [recipe, setRecipe] = useState<RecipeEntity>(currentRecipe)

	useEffect(() => {
		setRecipe(cloneRecipe(currentRecipe))
	}, [currentRecipe])

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setRecipe(prevRecipe => ({
			...prevRecipe,
			[name]: value,
		}))
	}

	const handleDetailedChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				[name]: value,
			},
		}))
	}

	const handleArrayChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		field: 'cooking_steps' | 'ingredients'
	) => {
		const { value } = e.target
		const updatedArray = [...recipe.detailed_info[field]]
		updatedArray[index] = value
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				[field]: updatedArray,
			},
		}))
	}

	const addArrayField = (field: 'cooking_steps' | 'ingredients') => {
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				[field]: [
					...prevRecipe.detailed_info[field],
					field === 'cooking_steps' ? '' : { name: '', alternatives: [''] },
				],
			},
		}))
	}

	const handleIngredientChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		index: number,
		subfield: 'name' | 'alternatives',
		altIndex?: number
	) => {
		const { value } = e.target
		const updatedIngredients = [...recipe.detailed_info.ingredients]
		if (subfield === 'name') {
			updatedIngredients[index].name = value
		} else if (altIndex !== undefined) {
			updatedIngredients[index].alternatives[altIndex] = value
		}
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				ingredients: updatedIngredients,
			},
		}))
	}

	const addAlternativeField = (index: number) => {
		const updatedIngredients = [...recipe.detailed_info.ingredients]
		updatedIngredients[index].alternatives.push('')
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				ingredients: updatedIngredients,
			},
		}))
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		onSubmit(recipe)
		console.log(recipe)
	}

	return (
		<>
			<Header>
				<div className={styles.content}>
					<h1>Редактировать рецепт</h1>
					<div className={styles.description}>
						<p>Форма для редактирования рецепта</p>
					</div>
				</div>
			</Header>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label className={styles.label}>Recipe Name:</label>
					<input
						className={styles.input}
						type='text'
						name='recipe_name'
						value={recipe.recipe_name}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Preview URL:</label>
					<input
						className={styles.input}
						type='text'
						name='preview'
						value={recipe.preview}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Description:</label>
					<textarea
						className={styles.textarea}
						name='description'
						value={recipe.detailed_info.description}
						onChange={handleDetailedChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Difficulty:</label>
					<input
						className={styles.input}
						type='text'
						name='difficulty'
						value={recipe.detailed_info.difficulty}
						onChange={handleDetailedChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Cooking Steps:</label>
					{recipe.detailed_info.cooking_steps.map((step, index) => (
						<div key={index} className={styles.formGroup}>
							<input
								className={styles.input}
								type='text'
								value={step}
								onChange={e => handleArrayChange(e, index, 'cooking_steps')}
							/>
						</div>
					))}
					<button
						type='button'
						className={styles.button}
						onClick={() => addArrayField('cooking_steps')}
					>
						добавить шаг
					</button>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>Ingredients:</label>
					{recipe.detailed_info.ingredients.map((ingredient, index) => (
						<div key={index} className={styles.formGroup}>
							<input
								className={styles.input}
								type='text'
								value={ingredient.name}
								placeholder='Ingredient'
								onChange={e => handleIngredientChange(e, index, 'name')}
							/>
							{ingredient.alternatives.map((alternative, altIndex) => (
								<div key={altIndex} className={styles.formGroup}>
									<input
										className={styles.input}
										type='text'
										value={alternative}
										placeholder='Alternative'
										onChange={e =>
											handleIngredientChange(e, index, 'alternatives', altIndex)
										}
									/>
								</div>
							))}
							<button
								type='button'
								className={styles.button}
								onClick={() => addAlternativeField(index)}
							>
								добавить альтернативу
							</button>
						</div>
					))}
					<button
						type='button'
						className={styles.button}
						onClick={() => addArrayField('ingredients')}
					>
						добавить ингридиент
					</button>
				</div>
				<button type='submit' className={styles.button}>
					подтвердить
				</button>
			</form>
		</>
	)
}

export default EditRecipeForm
