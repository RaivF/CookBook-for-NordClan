import { RecipeEntity } from '../../store/types'

interface Ingredient {
	name: string
	alternatives: string[]
}

interface DetailedInfo {
	description: string
	likedUsers: string[]
	cooking_steps: string[]
	ingredients: Ingredient[]
	difficulty: string
}

export interface Recipe {
	id: string
	created: string
	recipe_name: string
	preview: string
	detailed_info: DetailedInfo
}

export const searchRecipes = (
	recipes: RecipeEntity[],
	query: string
): RecipeEntity[] => {
	if (!query) {
		return []
	}

	return recipes.filter(recipe => {
		const recipeNameMatch = recipe.recipe_name
			.toLowerCase()
			.includes(query.toLowerCase())
		const descriptionMatch = recipe.detailed_info.description
			.toLowerCase()
			.includes(query.toLowerCase())
		const ingredientsMatch = recipe.detailed_info.ingredients.some(ingredient =>
			ingredient.name.toLowerCase().includes(query.toLowerCase())
		)
		const alternativeIngredientsMatch = recipe.detailed_info.ingredients.some(
			ingredient =>
				ingredient.alternatives.some(alt =>
					alt.toLowerCase().includes(query.toLowerCase())
				)
		)

		return (
			recipeNameMatch ||
			descriptionMatch ||
			ingredientsMatch ||
			alternativeIngredientsMatch
		)
	})
}
