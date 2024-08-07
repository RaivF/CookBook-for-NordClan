/* eslint-disable @typescript-eslint/no-explicit-any */

import { useNavigate } from 'react-router-dom'
import RecipeCard from '../RecipeList/components/UserCard'
import { RecipeEntity } from '../../store/types'

type recipesType = {
	recipes: RecipeEntity[]
}
export const FindingRecipeList = ({ recipes }: recipesType) => {
	console.log(recipes)
	const navigate = useNavigate()
	const goToAbout = (e: string) => {
		navigate(`/recipe/${e}`)
	}
	return (
		<div>
			{recipes.map((recipe: RecipeEntity) => (
				<div key={recipe.id} onClick={() => goToAbout(recipe.id)}>
					<RecipeCard key={recipe.id} data={recipe} />
				</div>
			))}
		</div>
	)
}
