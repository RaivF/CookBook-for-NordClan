import React, { useState, useEffect } from 'react'
import styles from './RecipeForm.module.css'
import { Header } from '../../components/Layout/Header'
import { useAppSelector } from '../../store/store'
import Modal from 'react-modal'
import { RecipeEntity } from '../../store/types'

interface RecipeFormProps {
	onSubmit: (recipe: RecipeEntity) => void
	initialRecipe?: RecipeEntity
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, initialRecipe }) => {
	const userName = useAppSelector(state => state.session.sessionInfo.userName)
	const [modalIsOpen, setModalIsOpen] = useState(false)
	const [errors, setErrors] = useState<string[]>([])

	const handleClickAdd = () => {
		setModalIsOpen(true)
	}

	const closeModal = () => {
		setModalIsOpen(false)
	}

	const [recipe, setRecipe] = useState<RecipeEntity>({
		id: '',
		recipe_name: '',
		created: userName,
		preview: '',
		detailed_info: {
			likedUsers: [''],
			description: '',
			cooking_steps: [''],
			ingredients: [{ name: '', alternatives: [''] }],
			difficulty: '',
		},
	})

	useEffect(() => {
		if (initialRecipe) {
			setRecipe(initialRecipe)
		}
	}, [initialRecipe])

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
		const updatedIngredients = recipe.detailed_info.ingredients.map(
			(ingredient, i) => {
				if (i === index) {
					return {
						...ingredient,
						alternatives: [...ingredient.alternatives, ''],
					}
				}
				return ingredient
			}
		)
		setRecipe(prevRecipe => ({
			...prevRecipe,
			detailed_info: {
				...prevRecipe.detailed_info,
				ingredients: updatedIngredients,
			},
		}))
	}

	const validateForm = () => {
		const newErrors: string[] = []

		if (!recipe.recipe_name)
			newErrors.push('поле "название рецепта" не может быть пустым')
		if (!recipe.preview)
			newErrors.push('поле "ссылка на изображение" не может быть пустым')
		if (!recipe.detailed_info.description)
			newErrors.push('поле "описание" не может быть пустым')
		if (!recipe.detailed_info.difficulty)
			newErrors.push('поле "сложность" не может быть пустым')
		if (!recipe.detailed_info.cooking_steps.some(step => step.trim() !== ''))
			newErrors.push('хотя бы один шаг готовки должен присутствовать')
		if (
			!recipe.detailed_info.ingredients.some(
				ingredient => ingredient.name.trim() !== ''
			)
		)
			newErrors.push('хотя бы один ингридиент должен присутствовать')

		setErrors(newErrors)
		return newErrors.length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (validateForm()) {
			onSubmit(recipe)
			handleClickAdd()
		}
	}

	return (
		<>
			<Header>
				<div className={styles.content}>
					<h1> Создать рецепт</h1>
					<div className={styles.description}>
						<p>
							Форма для {initialRecipe ? 'редактирования' : 'создания'} рецепта
						</p>
					</div>
				</div>
			</Header>
			<form className={styles.form} onSubmit={handleSubmit}>
				<div className={styles.formGroup}>
					<label className={styles.label}>название рецепта:</label>
					<input
						className={styles.input}
						type='text'
						name='recipe_name'
						value={recipe.recipe_name}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>
						ссылка на изображение готового блюда:
					</label>
					<input
						className={styles.input}
						type='text'
						name='preview'
						value={recipe.preview}
						onChange={handleChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>описание рецепта:</label>
					<textarea
						className={styles.textarea}
						name='description'
						value={recipe.detailed_info.description}
						onChange={handleDetailedChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>сложность:</label>
					<input
						className={styles.input}
						type='text'
						name='difficulty'
						value={recipe.detailed_info.difficulty}
						onChange={handleDetailedChange}
					/>
				</div>
				<div className={styles.formGroup}>
					<label className={styles.label}>шаги приготовления:</label>
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
					<label className={styles.label}>ингридиенты:</label>
					{recipe.detailed_info.ingredients.map((ingredient, index) => (
						<div key={index} className={styles.formGroup}>
							<input
								className={styles.input}
								type='text'
								value={ingredient.name}
								placeholder='ингридиент'
								onChange={e => handleIngredientChange(e, index, 'name')}
							/>
							{ingredient.alternatives.map((alternative, altIndex) => (
								<div key={altIndex} className={styles.formGroup}>
									<input
										className={styles.input}
										type='text'
										value={alternative}
										placeholder='альтернатива'
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
				{errors.length > 0 && (
					<div className={styles.errorMessages}>
						{errors.map((error, index) => (
							<p key={index} className={styles.errorMessage}>
								{error}
							</p>
						))}
					</div>
				)}
				<button type='submit' className={styles.button}>
					подтвердить
				</button>
			</form>
			<Modal
				isOpen={modalIsOpen}
				onRequestClose={closeModal}
				contentLabel='Confirm Deletion'
				className={styles.modal}
				overlayClassName={styles.overlay}
			>
				<h2>Рецепт успешно добавлен</h2>
				<div className={styles.modalActions}>
					<button onClick={closeModal}>X</button>
				</div>
			</Modal>
		</>
	)
}

export default RecipeForm
