import { useParams } from 'react-router-dom'
import style from './styles/UserDetails.module.css'
import { Header } from '../../components/Layout/Header'
import { useFindRecipe } from '../../hooks/useCurrentUser'
import { RecipeEntity } from '../../store/types'
import { ReactNode } from 'react'

export const RecipeDetails = () => {
	const params = useParams()
	const currentRecipe = useFindRecipe(params.id!) || errorOBJ

	return (
		<div className={style.container}>
			<Header>
				<div className={style.profile}>
					<div className={style.nameAndStatus}>
						<h1>{currentRecipe.recipe_name}</h1>
					</div>
				</div>
			</Header>
			<main className={style.mainContent}>
				<div className={style.description}>
					<div className={style.imageProfile}>
						<img src={currentRecipe.preview} alt='Recipe' />
					</div>
					<h2>Описание</h2>
					<p>{currentRecipe.detailed_info.description}</p>
				</div>
				<div className={style.ingredients}>
					<h2>Ингредиенты</h2>
					<ul>
						{currentRecipe.detailed_info.ingredients.map(
							(ingredient, index: number) => (
								<li className={style.li} key={index}>
									{ingredient.name}
									{ingredient.alternatives.length > 0 && (
										<ul>
											{ingredient.alternatives.map(
												(alt: Iterable<ReactNode>, altIndex: number) => (
													<li key={altIndex}>{alt}</li>
												)
											)}
										</ul>
									)}
								</li>
							)
						)}
					</ul>
				</div>
				<div className={style.cookingSteps}>
					<h2>Шаги приготовления</h2>
					{currentRecipe.detailed_info.cooking_steps.map((step, index) => (
						<div key={index} className={style.step}>
							<p className={style.index}>Шаг {index + 1}:</p>
							<p className={style.stepDescription}>{step}</p>
						</div>
					))}
				</div>
				<h2>Альтернативные ингредиенты</h2>
				<div className={style.altIngredients}>
					{currentRecipe.detailed_info.ingredients.map(
						(ingredient, index) =>
							ingredient.alternatives.length && (
								<div key={index}>
									<h3>{ingredient.name}</h3>
									<ul>
										{ingredient.alternatives.map(
											(alt: Iterable<ReactNode>, altIndex: number) => (
												<li key={altIndex}>{alt}</li>
											)
										)}
									</ul>
								</div>
							)
					)}
				</div>
			</main>
		</div>
	)
}

export const errorOBJ: RecipeEntity = {
	id: '',
	created: '',
	recipe_name: '',
	preview: '',
	detailed_info: {
		description: '',
		likedUsers: [''],
		cooking_steps: [],
		ingredients: [],
		difficulty: '',
	},
}

export default RecipeDetails
